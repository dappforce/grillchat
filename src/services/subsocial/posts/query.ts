import { poolQuery } from '@/subsocial-query'
import {
  createSubsocialQuery,
  SubsocialParam,
} from '@/subsocial-query/subsocial'
import { PostData } from '@subsocial/api/types'

export const getPost = poolQuery<SubsocialParam<string>, PostData>({
  multiCall: async (allParams) => {
    if (allParams.length === 0) return []
    const [{ api }] = allParams
    const postIds = allParams.map(({ data }) => data).filter((id) => !!id)
    if (postIds.length === 0) return []

    const res = await api.findPublicPosts(postIds)
    return res
  },
  resultMapper: {
    paramToKey: (param) => param.data,
    resultToKey: (result) => result?.id ?? '',
  },
})
export const getPostQuery = createSubsocialQuery({
  key: 'getComment',
  getData: getPost,
})
