import { createQueryKeys, QueryConfig } from '@/subsocial-query'
import { useSubsocialQuery } from '@/subsocial-query/subsocial'
import { useRef } from 'react'
import { useSubscribeCommentIdsByPostId } from './subscription'

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
