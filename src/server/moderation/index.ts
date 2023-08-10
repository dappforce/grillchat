import { gql } from 'graphql-request'
import {
  AddPostIdToOrgMessageQuery,
  AddPostIdToOrgMessageQueryVariables,
  BlockResourceMessageQuery,
  BlockResourceMessageQueryVariables,
  CommitModerationActionMutation,
  CommitModerationActionMutationVariables,
  GetBlockedInPostIdDetailedQuery,
  GetBlockedInPostIdDetailedQueryVariables,
  GetBlockedResourcesQuery,
  GetBlockedResourcesQueryVariables,
  GetModerationReasonsQuery,
  GetModerationReasonsQueryVariables,
  GetModeratorDataQuery,
  GetModeratorDataQueryVariables,
  InitModerationOrgMessageQuery,
  InitModerationOrgMessageQueryVariables,
  UnblockResourceMessageQuery,
  UnblockResourceMessageQueryVariables,
} from './generated'
import { mapBlockedResources, moderationRequest } from './utils'

const GET_BLOCKED_RESOURCES = gql`
  query GetBlockedResources($spaceIds: [String!]!, $postIds: [String!]!) {
    blockedResourceIdsBatch(ctxSpaceIds: $spaceIds, ctxPostIds: $postIds) {
      byCtxSpaceIds {
        id
        blockedResourceIds
      }
      byCtxPostIds {
        id
        blockedResourceIds
      }
    }
  }
`
export async function getBlockedResources(
  variables: GetBlockedResourcesQueryVariables
) {
  const data = await moderationRequest<
    GetBlockedResourcesQuery,
    GetBlockedResourcesQueryVariables
  >({
    document: GET_BLOCKED_RESOURCES,
    variables,
  })

  const blockedInSpaceIds = data.blockedResourceIdsBatch.byCtxSpaceIds.map(
    ({ blockedResourceIds, id }) => ({
      id,
      blockedResources: mapBlockedResources(blockedResourceIds, (id) => id),
    })
  )
  const blockedInPostIds = data.blockedResourceIdsBatch.byCtxPostIds.map(
    ({ blockedResourceIds, id }) => ({
      id,
      blockedResources: mapBlockedResources(blockedResourceIds, (id) => id),
    })
  )

  return { blockedInSpaceIds, blockedInPostIds }
}

const GET_BLOCKED_IN_POST_ID_DETAILED = gql`
  query GetBlockedInPostIdDetailed($postId: String!) {
    blockedResourceDetailed(ctxPostId: $postId, blocked: true) {
      resourceId
      reason {
        id
        reasonText
      }
    }
  }
`
export async function getBlockedInPostIdDetailed(postId: string) {
  const data = await moderationRequest<
    GetBlockedInPostIdDetailedQuery,
    GetBlockedInPostIdDetailedQueryVariables
  >({
    document: GET_BLOCKED_IN_POST_ID_DETAILED,
    variables: { postId },
  })
  return mapBlockedResources(
    data.blockedResourceDetailed,
    (res) => res.resourceId
  )
}

export const GET_MODERATION_REASONS = gql`
  query GetModerationReasons {
    reasonsAll {
      id
      reasonText
    }
  }
`
export async function getModerationReasons() {
  const data = await moderationRequest<
    GetModerationReasonsQuery,
    GetModerationReasonsQueryVariables
  >({
    document: GET_MODERATION_REASONS,
  })
  return data.reasonsAll
}

export const GET_MODERATOR_DATA = gql`
  query GetModeratorData($address: String!) {
    moderatorBySubstrateAddress(substrateAddress: $address) {
      organisation {
        ctxPostIds
      }
    }
  }
`
export async function getModeratorData(
  variables: GetModeratorDataQueryVariables
) {
  const res = await moderationRequest<
    GetModeratorDataQuery,
    GetModeratorDataQueryVariables
  >({
    document: GET_MODERATOR_DATA,
    variables,
  })
  return res.moderatorBySubstrateAddress?.organisation?.ctxPostIds ?? null
}

export const INIT_MODERATION_ORG_MESSAGE = gql`
  query InitModerationOrgMessage(
    $address: String!
    $postId: String!
    $spaceId: String!
  ) {
    initModeratorWithOrganisationMessage(
      input: {
        substrateAddress: $address
        ctxPostIds: [$postId]
        ctxSpaceIds: [$spaceId]
      }
    ) {
      messageTpl
    }
  }
`
export const ADD_POST_ID_TO_ORG_MESSAGE = gql`
  query AddPostIdToOrgMessage($address: String!, $postId: String!) {
    addCtxPostIdToOrganisationMessage(
      input: { substrateAddress: $address, ctxPostId: $postId }
    ) {
      messageTpl
    }
  }
`
export async function initModerationOrgMessage(
  variables: InitModerationOrgMessageQueryVariables
) {
  const moderator = await getModeratorData({ address: variables.address })
  if (!moderator) {
    const data = await moderationRequest<
      InitModerationOrgMessageQuery,
      InitModerationOrgMessageQueryVariables
    >({
      document: INIT_MODERATION_ORG_MESSAGE,
      variables,
    })
    return data.initModeratorWithOrganisationMessage?.messageTpl
  }

  const data = await moderationRequest<
    AddPostIdToOrgMessageQuery,
    AddPostIdToOrgMessageQueryVariables
  >({
    document: ADD_POST_ID_TO_ORG_MESSAGE,
    variables,
  })
  return data.addCtxPostIdToOrganisationMessage?.messageTpl
}

export const BLOCK_RESOURCE_MESSAGE = gql`
  query BlockResourceMessage(
    $address: String!
    $resourceId: String!
    $reasonId: String!
    $ctxPostId: String!
  ) {
    blockResourceByIdMessage(
      input: {
        substrateAddress: $address
        resourceId: $resourceId
        reasonId: $reasonId
        ctxPostIds: [$ctxPostId]
      }
    ) {
      messageTpl
    }
  }
`
export async function blockResourceMessage(
  variables: BlockResourceMessageQueryVariables
) {
  const res = await moderationRequest<
    BlockResourceMessageQuery,
    BlockResourceMessageQueryVariables
  >({
    document: BLOCK_RESOURCE_MESSAGE,
    variables,
  })
  return res.blockResourceByIdMessage?.messageTpl
}

export const UNBLOCK_RESOURCE_MESSAGE = gql`
  query UnblockResourceMessage(
    $address: String!
    $resourceId: String!
    $ctxPostId: String!
  ) {
    unblockResourceByIdMessage(
      input: {
        substrateAddress: $address
        resourceId: $resourceId
        ctxPostIds: [$ctxPostId]
      }
    ) {
      messageTpl
    }
  }
`
export async function unblockResourceMessage(
  variables: UnblockResourceMessageQueryVariables
) {
  const res = await moderationRequest<
    UnblockResourceMessageQuery,
    UnblockResourceMessageQueryVariables
  >({
    document: UNBLOCK_RESOURCE_MESSAGE,
    variables,
  })
  return res.unblockResourceByIdMessage?.messageTpl
}

export const COMMIT_MODERATION_ACTION = gql`
  mutation CommitModerationAction($signedMessage: String!) {
    commitSignedMessageWithAction(signedMessage: $signedMessage) {
      success
      message
    }
  }
`
export async function commitAction(
  variables: CommitModerationActionMutationVariables
) {
  const res = await moderationRequest<
    CommitModerationActionMutation,
    CommitModerationActionMutationVariables
  >({
    document: COMMIT_MODERATION_ACTION,
    variables,
  })
  return res.commitSignedMessageWithAction
}
