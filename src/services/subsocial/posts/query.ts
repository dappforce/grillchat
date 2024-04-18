import { createQuery, poolQuery } from '@/subsocial-query'
import { getPostIdsBySpaceIds } from './fetcher'

const getPostIdsBySpaceId = poolQuery<
  string,
  { spaceId: string; postIds: string[] }
>({
  name: 'getPostIdsBySpaceId',
  multiCall: async (allParams) => {
    if (allParams.length === 0) return []
    return getPostIdsBySpaceIds(allParams)
  },
  resultMapper: {
    paramToKey: (param) => param,
    resultToKey: (result) => result?.spaceId ?? '',
  },
})
export const getPostIdsBySpaceIdQuery = createQuery({
  key: 'postIdsBySpaceId',
  fetcher: getPostIdsBySpaceId,
})
