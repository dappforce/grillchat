import { ApiModerationBlockedInPostIdsResponse } from '@/pages/api/moderation/blocked/post-ids'
import { ApiModerationBlockedInSpaceIdsResponse } from '@/pages/api/moderation/blocked/space-ids'
import {
  ApiModerationModeratorParams,
  ApiModerationModeratorResponse,
} from '@/pages/api/moderation/moderator'
import { ApiModerationReasonsResponse } from '@/pages/api/moderation/reasons'
import { createQuery, poolQuery } from '@/subsocial-query'
import axios, { AxiosResponse } from 'axios'

const getBlockedInSpaceId = poolQuery<
  string,
  ApiModerationBlockedInSpaceIdsResponse['data'][number]
>({
  multiCall: async (params) => {
    const filteredParams = params.filter(Boolean)
    if (!filteredParams.length) return []

    const response = await axios.get(
      '/api/moderation/blocked/space-ids?' +
        filteredParams.map((n) => `spaceIds=${n}`).join('&')
    )
    const resData = response.data as ApiModerationBlockedInSpaceIdsResponse
    return resData.data
  },
  resultMapper: {
    paramToKey: (spaceId) => spaceId,
    resultToKey: (result) => result.spaceId,
  },
})
export const getBlockedInSpaceIdQuery = createQuery({
  key: 'getBlockedInSpaceId',
  fetcher: getBlockedInSpaceId,
})

const getBlockedInPostId = poolQuery<
  string,
  ApiModerationBlockedInPostIdsResponse['data'][number]
>({
  multiCall: async (params) => {
    const filteredParams = params.filter(Boolean)
    if (!filteredParams.length) return []

    const response = await axios.get(
      '/api/moderation/blocked/post-ids?' +
        filteredParams.map((n) => `spaceIds=${n}`).join('&')
    )
    const resData = response.data as ApiModerationBlockedInPostIdsResponse
    return resData.data
  },
  resultMapper: {
    paramToKey: (postId) => postId,
    resultToKey: (result) => result.postId,
  },
})
export const getBlockedInPostIdQuery = createQuery({
  key: 'getBlockedInPostId',
  fetcher: getBlockedInPostId,
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
