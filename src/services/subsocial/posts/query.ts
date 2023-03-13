import { poolQuery } from '@/subsocial-query'
import {
  createSubsocialQuery,
  SubsocialParam,
} from '@/subsocial-query/subsocial'
import { PostData } from '@subsocial/api/types'

const getPost = poolQuery<SubsocialParam<string>, PostData>({
  multiCall: async (allParams) => {
    if (allParams.length === 0) return []
    const [{ api }] = allParams
    const postIds = allParams.map(({ data }) => data).filter((id) => !!id)
    if (postIds.length === 0) return []

    console.log('fetching posts...')
    const res = await api.findPublicPosts(postIds)
    console.log('done fetching')
    return res
  },
  resultMapper: {
    paramToKey: (param) => param.data,
    resultToKey: (result) => result?.id ?? '',
  },
})
export const getPostQuery = createSubsocialQuery({
  key: 'getPost',
  getData: getPost,
})

const getPostsBySpaceId = poolQuery<
  SubsocialParam<string>,
  { spaceId: string; postIds: string[] }
>({
  multiCall: async (allParams) => {
    if (allParams.length === 0) return []
    const [{ api }] = allParams
    const spaceIds = allParams.map(({ data }) => data).filter((id) => !!id)
    if (spaceIds.length === 0) return []

    const res = await Promise.all(
      spaceIds.map((spaceId) => api.blockchain.postIdsBySpaceId(spaceId))
    )
    return res.map((postIds, i) => ({
      spaceId: spaceIds[i],
      postIds,
    }))
  },
  resultMapper: {
    paramToKey: (param) => param.data,
    resultToKey: (result) => result?.spaceId ?? '',
  },
})
export const getPostIdsBySpaceIdQuery = createSubsocialQuery({
  key: 'getPostIdsBySpaceId',
  getData: getPostsBySpaceId,
})
