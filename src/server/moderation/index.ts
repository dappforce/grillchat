import { gql } from 'graphql-request'
import {
  AddPostIdToOrgMessageQuery,
  AddPostIdToOrgMessageQueryVariables,
  BlockResourceMessageQuery,
  BlockResourceMessageQueryVariables,
  CommitModerationActionMutation,
  CommitModerationActionMutationVariables,
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

const generateBlockedInSpaceIds = (spaceIds: string[]) => {
  return `
    query GetBlockedInSpaceIds {
      ${spaceIds.map(
        (hubId) =>
          `SEPARATOR${hubId}: blockedResourceIds(
            ctxSpaceId: "${hubId}"
            blocked: true
          )`
      )}
    }
  `
}
export async function getBlockedInSpaceIds(spaceIds: string[]) {
  const data = await moderationRequest<Record<string, string[]>>({
    document: generateBlockedInSpaceIds(spaceIds),
  })

  return Object.entries(data).map(([key, res]) => {
    const [_, spaceId] = key.split('SEPARATOR')
    return {
      spaceId,
      blockedResources: mapBlockedResources(res),
    }
  })
}

const generateBlockedInPostIds = (postIds: string[]) => {
  return `
    query GetBlockedInPostIds {
      ${postIds.map(
        (postId) =>
          `SEPARATOR${postId}: blockedResourceIds(
            ctxPostId: "${postId}"
            blocked: true
          )`
      )}
    }
  `
}

export async function getBlockedInPostIds(postIds: string[]) {
  const data = await moderationRequest<Record<string, string[]>>({
    document: generateBlockedInPostIds(postIds),
  })

  return Object.entries(data).map(([key, res]) => {
    const [_, postId] = key.split('SEPARATOR')
    return {
      postId,
      blockedResources: mapBlockedResources(res),
    }
  })
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
    $ctxSpaceId: String!
  ) {
    blockResourceByIdMessage(
      input: {
        substrateAddress: $address
        resourceId: $resourceId
        reasonId: $reasonId
        ctxPostIds: [$ctxPostId]
        ctxSpaceIds: [$ctxSpaceId]
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
    $ctxSpaceId: String!
  ) {
    unblockResourceByIdMessage(
      input: {
        substrateAddress: $address
        resourceId: $resourceId
        ctxPostIds: [$ctxPostId]
        ctxSpaceIds: [$ctxSpaceId]
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
