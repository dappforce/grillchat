import { poolQuery } from '@/subsocial-query'
import {
  createSubsocialQuery,
  SubsocialParams,
} from '@/subsocial-query/subsocial/query'

const getChatIdsBySpaceId = poolQuery<
  SubsocialParams<string>,
  { spaceId: string; chatIds: string[] }
>({
  multiCall: async (allParams) => {
    if (allParams.length === 0) return []
    const [{ api }] = allParams
    const spaceIds = allParams.map(({ data }) => data).filter((id) => !!id)
    if (spaceIds.length === 0) return []

    const res = await Promise.all(
      spaceIds.map((spaceId) => api.blockchain.postIdsBySpaceId(spaceId))
    )
    return res.map((chatIds, i) => ({
      spaceId: spaceIds[i],
      chatIds,
    }))
  },
  resultMapper: {
    paramToKey: (param) => param.data,
    resultToKey: (result) => result?.spaceId ?? '',
  },
})
export const getChatIdsBySpaceIdQuery = createSubsocialQuery({
  key: 'getPostIdsBySpaceId',
  getData: getChatIdsBySpaceId,
})
