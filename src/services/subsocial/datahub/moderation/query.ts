import { gql } from 'graphql-request'
import {
  GetBlockedInPostIdDetailedQuery,
  GetBlockedInPostIdDetailedQueryVariables,
  GetBlockedResourcesQuery,
  GetBlockedResourcesQueryVariables,
  GetModerationReasonsQuery,
  GetModerationReasonsQueryVariables,
  GetModeratorDataQuery,
  GetModeratorDataQueryVariables,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'
import { mapBlockedResources } from './utils'

const GET_BLOCKED_RESOURCES = gql`
  query GetBlockedResources($spaceIds: [String!]!, $postIds: [String!]!) {
    moderationBlockedResourceIdsBatch(
      ctxSpaceIds: $spaceIds
      ctxPostIds: $postIds
    ) {
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
  const data = await datahubQueryRequest<
    GetBlockedResourcesQuery,
    GetBlockedResourcesQueryVariables
  >({
    document: GET_BLOCKED_RESOURCES,
    variables,
  })

  const blockedInSpaceIds =
    data.moderationBlockedResourceIdsBatch.byCtxSpaceIds.map(
      ({ blockedResourceIds, id }) => ({
        id,
        blockedResources: mapBlockedResources(blockedResourceIds, (id) => id),
      })
    )
  const blockedInPostIds =
    data.moderationBlockedResourceIdsBatch.byCtxPostIds.map(
      ({ blockedResourceIds, id }) => ({
        id,
        blockedResources: mapBlockedResources(blockedResourceIds, (id) => id),
      })
    )

  return { blockedInSpaceIds, blockedInPostIds }
}

const GET_BLOCKED_IN_POST_ID_DETAILED = gql`
  query GetBlockedInPostIdDetailed($postId: String!) {
    moderationBlockedResourceDetailed(ctxPostId: $postId, blocked: true) {
      resourceId
      reason {
        id
        reasonText
      }
    }
  }
`
export async function getBlockedInPostIdDetailed(postId: string) {
  const data = await datahubQueryRequest<
    GetBlockedInPostIdDetailedQuery,
    GetBlockedInPostIdDetailedQueryVariables
  >({
    document: GET_BLOCKED_IN_POST_ID_DETAILED,
    variables: { postId },
  })
  return mapBlockedResources(
    data.moderationBlockedResourceDetailed,
    (res) => res.resourceId
  )
}

export const GET_MODERATION_REASONS = gql`
  query GetModerationReasons {
    moderationReasonsAll {
      id
      reasonText
    }
  }
`
export async function getModerationReasons() {
  const data = await datahubQueryRequest<
    GetModerationReasonsQuery,
    GetModerationReasonsQueryVariables
  >({
    document: GET_MODERATION_REASONS,
  })
  return data.moderationReasonsAll
}

export const GET_MODERATOR_DATA = gql`
  query GetModeratorData($address: String!) {
    moderators(args: { where: { substrateAddress: $address } }) {
      data {
        moderatorOrganizations {
          organisation {
            ctxPostIds
          }
        }
      }
    }
  }
`
export async function getModeratorData(
  variables: GetModeratorDataQueryVariables
) {
  const res = await datahubQueryRequest<
    GetModeratorDataQuery,
    GetModeratorDataQueryVariables
  >({
    document: GET_MODERATOR_DATA,
    variables,
  })
  const moderator = res.moderators?.data?.[0]
  const postIds: string[] = []
  moderator?.moderatorOrganizations?.forEach((org) => {
    postIds.push(...(org.organisation.ctxPostIds ?? []))
  })
  return postIds
}
