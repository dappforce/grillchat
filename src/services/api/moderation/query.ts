import { ApiModerationBlockedResourcesResponse } from '@/pages/api/moderation/blocked'
import { ApiModerationBlockedInPostIdsDetailedResponse } from '@/pages/api/moderation/blocked/post-id-detailed'
import {
  ApiModerationModeratorParams,
  ApiModerationModeratorResponse,
} from '@/pages/api/moderation/moderator'
import { ApiModerationReasonsResponse } from '@/pages/api/moderation/reasons'
import { createQuery, poolQuery } from '@/subsocial-query'
import axios, { AxiosResponse } from 'axios'

const getBlockedResources = poolQuery<
  { postId: string } | { spaceId: string },
  ApiModerationBlockedResourcesResponse['data']['blockedInPostIds'][number] & {
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

    const response = await axios.get(
      '/api/moderation/blocked?' +
        spaceIds.map((n) => `spaceIds=${n}`).join('&') +
        '&' +
        postIds.map((n) => `postIds=${n}`).join('&')
    )
    const resData = response.data as ApiModerationBlockedResourcesResponse
    return [
      ...resData.data.blockedInPostIds.map((data) => ({
        ...data,
        type: 'postId' as const,
      })),
      ...resData.data.blockedInSpaceIds.map((data) => ({
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
  fetcher: getBlockedResources,
})

export const getBlockedInPostIdDetailedQuery = createQuery({
  key: 'getBlockedInPostIdDetailed',
  fetcher: async (postId: string) => {
    const response = await axios.get<
      any,
      AxiosResponse<ApiModerationBlockedInPostIdsDetailedResponse>
    >(`/api/moderation/blocked/post-id-detailed`, { params: { postId } })
    return response.data.data
  },
})

export const getModerationReasonsQuery = createQuery({
  key: 'getModerationReasons',
  fetcher: async () => {
    const response = await axios.get('/api/moderation/reasons')
    return response.data.data as ApiModerationReasonsResponse['data']
  },
})

export const getModeratorQuery = createQuery({
  key: 'getModerator',
  fetcher: async (address: string) => {
    const response = await axios.get<
      any,
      AxiosResponse<ApiModerationModeratorResponse>,
      ApiModerationModeratorParams
    >('/api/moderation/moderator', {
      params: { address },
    })
    return { address, postIds: response.data.ctxPostIds ?? null }
  },
})
