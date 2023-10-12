import { getCommentIdsByPostIdQuery } from '@/services/subsocial/commentIds'
import { getPostMetadataQuery } from '@/services/subsocial/datahub/posts/query'
import { getDatahubConfig } from '@/utils/env/client'

export function useLastMessageId(chatId: string) {
  const canUseDatahub = !!getDatahubConfig()

  const { data: messageIds } = getCommentIdsByPostIdQuery.useQuery(chatId, {
    subscribe: true,
    enabled: !canUseDatahub,
  })
  const lastMessageId = messageIds?.[messageIds?.length - 1]

  const { data } = getPostMetadataQuery.useQuery(chatId, {
    enabled: canUseDatahub,
  })
  const lastIdFromDatahub = data?.lastCommentId

  return canUseDatahub ? lastIdFromDatahub : lastMessageId
}

export function useLastMessageIds(chatIds: string[]) {
  const canUseDatahub = !!getDatahubConfig()

  const commentIdsQueries = getCommentIdsByPostIdQuery.useQueries(chatIds, {
    subscribe: true,
    enabled: !canUseDatahub,
  })

  const postMetadatas = getPostMetadataQuery.useQueries(chatIds, {
    enabled: canUseDatahub,
  })

  const lastMessageIds = canUseDatahub
    ? postMetadatas.map(({ data }) => data?.lastCommentId)
    : commentIdsQueries.map(({ data }) => data?.[data?.length - 1])
  return lastMessageIds
}
