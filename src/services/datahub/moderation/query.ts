import { createQuery, poolQuery } from '@/subsocial-query'
import { getAppId } from '@/utils/env/client'
import { gql } from 'graphql-request'
import {
  GetBlockedInAppDetailedQuery,
  GetBlockedInAppDetailedQueryVariables,
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
  query GetBlockedResources(
    $spaceIds: [String!]!
    $postIds: [String!]!
    $appIds: [String!]!
  ) {
    moderationBlockedResourceIdsBatch(
      ctxSpaceIds: $spaceIds
      ctxPostIds: $postIds
      ctxAppIds: $appIds
    ) {
      byCtxSpaceIds {
        id
        blockedResourceIds
      }
      byCtxPostIds {
        id
        blockedResourceIds
      }
      byCtxAppIds {
        id
        blockedResourceIds
      }
    }
  }
`
export async function getBlockedResources(variables: {
  postEntityIds: string[]
  spaceIds: string[]
  appIds: string[]
}) {
  variables.postEntityIds = variables.postEntityIds.filter((id) => !!id)
  variables.spaceIds = variables.spaceIds.filter((id) => !!id)
  const data = await datahubQueryRequest<
    GetBlockedResourcesQuery,
    GetBlockedResourcesQueryVariables
  >({
    document: GET_BLOCKED_RESOURCES,
    variables: {
      postIds: variables.postEntityIds,
      spaceIds: variables.spaceIds,
      appIds: variables.appIds,
    },
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
  const blockedInAppIds =
    data.moderationBlockedResourceIdsBatch.byCtxAppIds.map(
      ({ blockedResourceIds, id }) => ({
        id,
        blockedResources: mapBlockedResources(blockedResourceIds, (id) => id),
      })
    )

  return { blockedInSpaceIds, blockedInPostIds, blockedInAppIds }
}
const pooledGetBlockedResource = poolQuery<
  { postEntityId: string } | { spaceId: string } | { appId: string },
  {
    id: string
    blockedResources: Record<ResourceTypes, string[]>
    type: 'spaceId' | 'postEntityId' | 'appId'
  }
>({
  multiCall: async (params) => {
    if (!params.length) return []
    const spaceIds: string[] = []
    const postEntityIds: string[] = []
    const appIds: string[] = []
    params.forEach((param) => {
      if ('postEntityId' in param && param.postEntityId)
        postEntityIds.push(param.postEntityId)
      else if ('spaceId' in param && param.spaceId) spaceIds.push(param.spaceId)
      else if ('appId' in param && param.appId) appIds.push(param.appId)
    })

    if (!postEntityIds.length && !spaceIds.length && !appIds.length) return []

    const response = await getBlockedResources({
      postEntityIds,
      spaceIds,
      appIds,
    })
    return [
      ...response.blockedInPostIds.map((data) => ({
        ...data,
        type: 'postEntityId' as const,
      })),
      ...response.blockedInSpaceIds.map((data) => ({
        ...data,
        type: 'spaceId' as const,
      })),
      ...response.blockedInAppIds.map((data) => ({
        ...data,
        type: 'appId' as const,
      })),
    ]
  },
  resultMapper: {
    paramToKey: (param) => {
      if ('postEntityId' in param) return `postEntityId:${param.postEntityId}`
      else if ('spaceId' in param) return `spaceId:${param.spaceId}`
      else return `appId:${param.appId}`
    },
    resultToKey: ({ type, id }) => {
      if (type === 'postEntityId') return `postEntityId:${id}`
      else if (type === 'spaceId') return `spaceId:${id}`
      else return `appId:${id}`
    },
  },
})
export const getBlockedResourcesQuery = createQuery({
  key: 'getBlockedResources',
  fetcher: pooledGetBlockedResource,
  defaultConfigGenerator: (params) => ({
    enabled:
      !!params &&
      (('postEntityId' in params && !!params?.postEntityId) ||
        ('spaceId' in params && !!params?.spaceId) ||
        ('appId' in params && !!params?.appId)),
  }),
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
  fetcher: async (postEntityId: string) => {
    const response = await getBlockedInPostIdDetailed(postEntityId)
    return response
  },
})

const GET_BLOCKED_IN_APP_DETAILED = gql`
  query GetBlockedInAppDetailed($appId: String!) {
    moderationBlockedResourcesDetailed(ctxAppIds: [$appId], blocked: true) {
      resourceId
      reason {
        id
        reasonText
      }
    }
  }
`
export async function getBlockedInAppDetailed() {
  const data = await datahubQueryRequest<
    GetBlockedInAppDetailedQuery,
    GetBlockedInAppDetailedQueryVariables
  >({
    document: GET_BLOCKED_IN_APP_DETAILED,
    variables: { appId: getAppId() },
  })
  return mapBlockedResources(
    data.moderationBlockedResourcesDetailed,
    (res) => res.resourceId
  )
}
export const getBlockedInAppDetailedQuery = createQuery({
  key: 'getBlockedInAppDetailed',
  fetcher: getBlockedInAppDetailed,
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
            id
            ctxPostIds
            ctxAppIds
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
  const appIds: string[] = []
  moderator?.moderatorOrganizations?.forEach((org) => {
    postIds.push(...(org.organization.ctxPostIds ?? []))
    appIds.push(...(org.organization.ctxAppIds ?? []))
  })
  const firstOrg = moderator?.moderatorOrganizations?.[0]
  return {
    postIds,
    appIds,
    exist: !!moderator,
    organizationId: firstOrg?.organization.id,
  }
}
export const getModeratorQuery = createQuery({
  key: 'getModerator',
  fetcher: async (address: string) => {
    const moderatorData = await getModeratorData({
      address,
    })
    return { address, ...moderatorData }
  },
})
