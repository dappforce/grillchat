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
