import { getCommentIdsByPostIdFromChainQuery } from '@/services/subsocial/commentIds'
import { getPostMetadataQuery } from '@/services/subsocial/datahub/posts/query'
import { getDatahubConfig } from '@/utils/env/client'

export function useMessagesCount(chatId: string) {
  const isDatahubEnabled = !!getDatahubConfig()
  const { data } = getPostMetadataQuery.useQuery(chatId, {
    enabled: isDatahubEnabled,
  })
  const messagesCount = data?.totalCommentsCount ?? 0

  // need length, and only if no datahub
  const { data: commentIds } = getCommentIdsByPostIdFromChainQuery.useQuery(
    chatId,
    {
      enabled: !isDatahubEnabled,
    }
  )

  if (isDatahubEnabled) {
    return messagesCount
  }
  return commentIds?.length ?? 0
}

export function useMessagesCounts(chatIds: string[]) {
  const isDatahubEnabled = !!getDatahubConfig()
  const postMetadataQueries = getPostMetadataQuery.useQueries(chatIds, {
    enabled: isDatahubEnabled,
  })

  // need length, and only if no datahub
  const commentIdsQueries = getCommentIdsByPostIdFromChainQuery.useQueries(
    chatIds,
    {
      enabled: !isDatahubEnabled,
    }
  )

  if (isDatahubEnabled) {
    return postMetadataQueries.map(({ data }) => data?.totalCommentsCount ?? 0)
  }
  return commentIdsQueries.map(({ data }) => data?.length ?? 0)
}
