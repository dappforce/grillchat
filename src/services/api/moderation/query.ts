import { ApiModerationBlockedInPostIdsResponse } from '@/pages/api/moderation/blocked/post-ids'
import { ApiModerationBlockedInSpaceIdsResponse } from '@/pages/api/moderation/blocked/space-ids'
import { createQuery, poolQuery } from '@/subsocial-query'
import axios from 'axios'

const getBlockedInSpaceId = poolQuery<
  string,
  ApiModerationBlockedInSpaceIdsResponse['data'][number]
>({
  multiCall: async (params) => {
    const response = await axios.get(
      '/api/moderation/blocked/space-ids?' +
        params.map((n) => `spaceIds=${n}`).join('&')
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
    const response = await axios.get('/api/moderation/blocked/post-ids', {
      params,
    })
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
