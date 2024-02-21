import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { isDatahubAvailable } from '@/services/datahub/utils'
import { getCommentIdsByPostIdFromChainQuery } from '@/services/subsocial/commentIds'

export function useMessagesCount(chatId: string) {
  const { data } = getPostMetadataQuery.useQuery(chatId, {
    enabled: isDatahubAvailable,
  })
  const messagesCount = data?.totalCommentsCount ?? 0

  // need length, and only if no datahub
  const { data: commentIds } = getCommentIdsByPostIdFromChainQuery.useQuery(
    chatId,
    {
      enabled: !isDatahubAvailable,
    }
  )

  if (isDatahubAvailable) {
    return messagesCount
  }
  return commentIds?.length ?? 0
}

export function useMessagesCounts(chatIds: string[]) {
  const postMetadataQueries = getPostMetadataQuery.useQueries(chatIds, {
    enabled: isDatahubAvailable,
  })

  // need length, and only if no datahub
  const commentIdsQueries = getCommentIdsByPostIdFromChainQuery.useQueries(
    chatIds,
    {
      enabled: !isDatahubAvailable,
    }
  )

  if (isDatahubAvailable) {
    return postMetadataQueries.map(({ data }) => data?.totalCommentsCount ?? 0)
  }
  return commentIdsQueries.map(({ data }) => data?.length ?? 0)
}
