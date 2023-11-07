import { getCommentIdsByPostIdFromChainQuery } from '@/services/subsocial/commentIds'
import { getPostMetadataQuery } from '@/services/subsocial/datahub/posts/query'
import { getDatahubConfig } from '@/utils/env/client'

export function useLastMessageId(chatId: string) {
  const isDatahubEnabled = !!getDatahubConfig()

  // need last message only
  const { data: messageIds } = getCommentIdsByPostIdFromChainQuery.useQuery(
    chatId,
    {
      subscribe: true,
      enabled: !isDatahubEnabled,
    }
  )
  const lastMessageId = messageIds?.[messageIds?.length - 1]

  const { data } = getPostMetadataQuery.useQuery(chatId, {
    enabled: isDatahubEnabled,
  })
  const lastIdFromDatahub = data?.lastCommentId

  return isDatahubEnabled ? lastIdFromDatahub : lastMessageId
}

export function useLastMessageIds(chatIds: string[]) {
  const isDatahubEnabled = !!getDatahubConfig()

  const commentIdsQueries = getCommentIdsByPostIdFromChainQuery.useQueries(
    chatIds,
    {
      subscribe: true,
      enabled: !isDatahubEnabled,
    }
  )

  const postMetadatas = getPostMetadataQuery.useQueries(chatIds, {
    enabled: isDatahubEnabled,
  })

  const lastMessageIds = isDatahubEnabled
    ? postMetadatas.map(({ data }) => data?.lastCommentId)
    : commentIdsQueries.map(({ data }) => data?.[data?.length - 1])
  return lastMessageIds
}
