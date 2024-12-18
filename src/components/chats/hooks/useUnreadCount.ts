import { getUnreadCountQuery } from '@/services/datahub/posts/query'

export default function useUnreadCount(chatId: string, lastReadTime: number) {
  const { data: unreadCount, isLoading } = getUnreadCountQuery.useQuery({
    chatId: chatId,
    lastRead: { timestamp: lastReadTime || 0 },
  })
  return {
    unreadCount: unreadCount ?? 0,
    isLoading,
  }
}
