import { createQueryKeys, QueryConfig } from '@/subsocial-query'
import {
  useSubsocialQueries,
  useSubsocialQuery,
} from '@/subsocial-query/subsocial/query'
import {
  useSubscribeCommentIdsByPostId,
  useSubscribeCommentIdsByPostIds,
} from './subscription'

const commentIdsByPostIdKey = 'comments'
export const getCommentIdsQueryKey = createQueryKeys<string>(
  commentIdsByPostIdKey
)
export function useCommentIdsByPostId(
  postId: string,
  config?: QueryConfig & { subscribe?: boolean }
) {
  useSubscribeCommentIdsByPostId(postId, !!config?.subscribe)
  return useSubsocialQuery(
    {
      key: commentIdsByPostIdKey,
      data: postId,
    },
    ({ api, data }) => {
      if (!config?.subscribe) {
        return api.blockchain.getReplyIdsByPostId(data)
      }

      // if subscribing, loading infinitely until the data is set manually from subscription handler
      return new Promise<string[]>(() => undefined)
    },
    config
  )
}

export function useCommentIdsByPostIds(
  postIds: string[],
  config?: QueryConfig & { subscribe?: boolean }
) {
  useSubscribeCommentIdsByPostIds(postIds, !!config?.subscribe)
  return useSubsocialQueries(
    {
      key: commentIdsByPostIdKey,
      data: postIds,
    },
    async ({ api, data }) => {
      if (!config?.subscribe) {
        return api.blockchain.getReplyIdsByPostId(data)
      }

      // if subscribing, loading infinitely until the data is set manually from subscription handler
      return new Promise<string[]>(() => undefined)
    },
    config
  )
}
