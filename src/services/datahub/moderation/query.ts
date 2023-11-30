import { createQuery, poolQuery } from '@/subsocial-query'
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
import { mapBlockedResources, ResourceTypes } from './utils'

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
export async function getBlockedResources(variables: {
  postIds: string[]
  spaceIds: string[]
}) {
  variables.postIds = variables.postIds.filter((id) => !!id)
  variables.spaceIds = variables.spaceIds.filter((id) => !!id)
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
const pooledGetBlockedResource = poolQuery<
  { postId: string } | { spaceId: string },
  {
    id: string
    blockedResources: Record<ResourceTypes, string[]>
    type: 'spaceId' | 'postId'
  }
>({
  multiCall: async (params) => {
    if (!params.length) return []
    const spaceIds: string[] = []
    const postIds: string[] = []
    params.forEach((param) => {
      if ('postId' in param && param.postId) postIds.push(param.postId)
      else if ('spaceId' in param && param.spaceId) spaceIds.push(param.spaceId)
    })

    if (!postIds.length && !spaceIds.length) return []

    const response = await getBlockedResources({
      postIds,
      spaceIds,
    })
    return [
      ...response.blockedInPostIds.map((data) => ({
        ...data,
        type: 'postId' as const,
      })),
      ...response.blockedInSpaceIds.map((data) => ({
        ...data,
        type: 'spaceId' as const,
      })),
    ]
  },
  resultMapper: {
    paramToKey: (param) => {
      if ('postId' in param) return `postId:${param.postId}`
      else return `spaceId:${param.spaceId}`
    },
    resultToKey: ({ type, id }) => {
      if (type === 'postId') return `postId:${id}`
      else return `spaceId:${id}`
    },
  },
})
export const getBlockedResourcesQuery = createQuery({
  key: 'getBlockedResources',
  fetcher: pooledGetBlockedResource,
})

const GET_BLOCKED_IN_POST_ID_DETAILED = gql`
  query GetBlockedInPostIdDetailed($postId: String!) {
    moderationBlockedResourcesDetailed(ctxPostIds: [$postId], blocked: true) {
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
    data.moderationBlockedResourcesDetailed,
    (res) => res.resourceId
  )
}
export const getBlockedInPostIdDetailedQuery = createQuery({
  key: 'getBlockedInPostIdDetailed',
  fetcher: async (postId: string) => {
    const response = await getBlockedInPostIdDetailed(postId)
    return response
  },
})

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
export const getModerationReasonsQuery = createQuery({
  key: 'getModerationReasons',
  fetcher: async () => {
    const response = await getModerationReasons()
    return response
  },
})

export const GET_MODERATOR_DATA = gql`
  query GetModeratorData($address: String!) {
    moderators(args: { where: { substrateAddress: $address } }) {
      data {
        moderatorOrganizations {
          organization {
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
    postIds.push(...(org.organization.ctxPostIds ?? []))
  })
  return { postIds, exist: !!moderator }
}
export const getModeratorQuery = createQuery({
  key: 'getModerator',
  fetcher: async (address: string) => {
    const { exist, postIds } = await getModeratorData({ address })
    return { address, postIds, exist }
  },
})
