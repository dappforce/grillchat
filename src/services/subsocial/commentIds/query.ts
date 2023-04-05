import { createQueryKeys, QueryConfig } from '@/subsocial-query'
import {
  useSubsocialQueries,
  useSubsocialQuery,
} from '@/subsocial-query/subsocial/query'
import { useRef } from 'react'
import {
  useSubscribeCommentIdsByPostId,
  useSubscribeCommentIdsByPostIds,
} from './subscription'

const commentIdsByPostIdKey = 'commentIdsByPostId'
export const getCommentIdsQueryKey = createQueryKeys<string>(
  commentIdsByPostIdKey
)
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
    ({ api, data }) => {
      if (!config?.subscribe) {
        return api.blockchain.getReplyIdsByPostId(data)
      }
      return promiseRef.current
    },
    config
  )
}

export function useCommentIdsByPostIds(
  postIds: string[],
  config?: QueryConfig & { subscribe?: boolean }
) {
  const resolverRef = useRef<(ids: string[][]) => void>(() => undefined)
  const promiseRef = useRef(
    new Promise<string[][]>((resolve) => {
      resolverRef.current = (ids: string[][]) => resolve(ids)
    })
  )
  useSubscribeCommentIdsByPostIds(
    postIds,
    !!config?.subscribe,
    resolverRef.current
  )
  return useSubsocialQueries(
    {
      key: commentIdsByPostIdKey,
      data: postIds,
    },
    async ({ api, data, idx }) => {
      if (!config?.subscribe) {
        return api.blockchain.getReplyIdsByPostId(data)
      }
      return (await promiseRef.current)[idx]
    },
    config
  )
}
