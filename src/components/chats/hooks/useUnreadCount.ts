import { getUnreadCountQuery } from '@/services/datahub/posts/query'

export default function useUnreadCount(chatId: string, lastReadTime: number) {
  const { data: unreadCount } = getUnreadCountQuery.useQuery(
    { chatId: chatId, lastRead: { timestamp: lastReadTime } },
    {
      enabled: !!lastReadTime,
    }
  )
  return unreadCount ?? 0
}
