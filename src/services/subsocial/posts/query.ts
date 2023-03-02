import { poolQuery } from '@/subsocial-query'
import {
  createSubsocialQuery,
  SubsocialParam,
} from '@/subsocial-query/subsocial'
import { PostData } from '@subsocial/api/types'

export const getPost = poolQuery<SubsocialParam<string>, PostData>({
  multiCall: async (allParams) => {
    const [{ api }] = allParams
    const postIds = allParams.map(({ data }) => data)
    console.log('Subsocial Service: getPost: multiCall', postIds)
    const res = await api.findPublicPosts(postIds)
    console.log('Fetch result', res, postIds)
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
