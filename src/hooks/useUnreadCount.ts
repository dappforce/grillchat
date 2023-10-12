import { getCommentIdsByPostIdQuery } from '@/services/subsocial/commentIds'
import { getUnreadCountQuery } from '@/services/subsocial/datahub/posts/query'
import { getDatahubConfig } from '@/utils/env/client'
import { useMemo } from 'react'

export default function useUnreadCount(chatId: string, lastReadId: string) {
  const { data: unreadCountFromDatahub } = getUnreadCountQuery.useQuery(
    { chatId: chatId, lastRead: { postId: lastReadId } },
    {
      enabled: !!getDatahubConfig() && !!lastReadId,
    }
  )

  const { data: messageIds } = getCommentIdsByPostIdQuery.useQuery(chatId)

  const unreadCount = useMemo(() => {
    const messagesLength = messageIds?.length
    if (!lastReadId || !messagesLength || messagesLength === 0) return 0
    const lastReadIndex = messageIds?.findIndex((id) => id === lastReadId)
    if (lastReadIndex === -1) return 0
    return messagesLength - 1 - lastReadIndex
  }, [messageIds, lastReadId])

  if (getDatahubConfig()) {
    return unreadCountFromDatahub ?? 0
  }
  return unreadCount ?? 0
}
