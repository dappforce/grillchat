import {
  poolQuery,
  QueryConfig,
  SubsocialParam,
  useSubsocialQuery,
} from '@/subsocial-query'
import { PostData } from '@subsocial/api/types'
import { useRef } from 'react'
import { useSubscribeCommentIdsByPostId } from './subscription'

export const getCommentKey = 'getComment'
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
export function useGetComment(id: string, config?: QueryConfig) {
  return useSubsocialQuery(
    {
      key: getCommentKey,
      data: id,
    },
    getPost,
    config
  )
}

export const commentIdsByPostIdKey = 'commentIdsByPostId'
export function useCommentIdsByPostId(
  postId: string,
  config?: QueryConfig & { subscribe?: boolean }
) {
  const resolverRef = useRef<(ids: string[]) => void>(() => undefined)
  const promiseRef = useRef(
    new Promise<string[]>((resolve) => {
      resolverRef.current = (ids: string[]) => resolve(ids)
    })
  )
  useSubscribeCommentIdsByPostId(
    postId,
    !!config?.subscribe,
    resolverRef.current
  )
  return useSubsocialQuery(
    {
      key: commentIdsByPostIdKey,
      data: postId,
    },
    () => promiseRef.current,
    config
  )
}
