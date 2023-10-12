import { getCommentIdsByPostIdQuery } from '@/services/subsocial/commentIds'
import { getLastCommentIdQuery } from '@/services/subsocial/datahub/posts/query'
import { getDatahubConfig } from '@/utils/env/client'

export function useLastMessageId(chatId: string) {
  const canUseDatahub = !!getDatahubConfig()

  const { data: messageIds } = getCommentIdsByPostIdQuery.useQuery(chatId, {
    subscribe: true,
    enabled: !canUseDatahub,
  })
  const lastMessageId = messageIds?.[messageIds?.length - 1]

  const { data: lastIdFromDatahub } = getLastCommentIdQuery.useQuery(chatId, {
    enabled: canUseDatahub,
  })

  return canUseDatahub ? lastIdFromDatahub : lastMessageId
}
