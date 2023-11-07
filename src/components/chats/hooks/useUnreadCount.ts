import { getCommentIdsByPostIdFromChainQuery } from '@/services/subsocial/commentIds'
import { getUnreadCountQuery } from '@/services/subsocial/datahub/posts/query'
import { getDatahubConfig } from '@/utils/env/client'
import { useMemo } from 'react'

export default function useUnreadCount(chatId: string, lastReadId: string) {
  if (getDatahubConfig()) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useUnreadCountFromDatahub(chatId, lastReadId)
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useUnreadCountFromBlockchain(chatId, lastReadId)
  }
}

function useUnreadCountFromDatahub(chatId: string, lastReadId: string) {
  const { data: unreadCountFromDatahub } = getUnreadCountQuery.useQuery(
    { chatId: chatId, lastRead: { postId: lastReadId } },
    {
      enabled: !!lastReadId,
    }
  )
  return unreadCountFromDatahub ?? 0
}

function useUnreadCountFromBlockchain(chatId: string, lastReadId: string) {
  const { data: messageIds } = getCommentIdsByPostIdFromChainQuery.useQuery(
    chatId,
    {
      enabled: true,
    }
  )

  const unreadCount = useMemo(() => {
    const messagesLength = messageIds?.length
    if (!lastReadId || !messagesLength || messagesLength === 0) return 0
    const lastReadIndex = messageIds?.findIndex((id) => id === lastReadId)
    if (lastReadIndex === -1) return 0
    return messagesLength - 1 - lastReadIndex
  }, [messageIds, lastReadId])

  return unreadCount ?? 0
}
