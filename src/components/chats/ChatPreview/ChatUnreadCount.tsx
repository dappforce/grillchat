import useLastReadTimeFromStorage from '@/components/chats/hooks/useLastReadMessageTimeFromStorage'
import useUnreadCount from '@/components/chats/hooks/useUnreadCount'
import { useMemo } from 'react'

export type ChatUnreadCountProps = {
  chatId: string
  children: (data: {
    unreadCount: number
    isLoading: boolean
  }) => React.ReactNode
}

export default function ChatUnreadCount({
  chatId,
  children,
}: ChatUnreadCountProps) {
  const { getLastReadTime } = useLastReadTimeFromStorage(chatId)
  const lastReadTime = useMemo(() => getLastReadTime() ?? '', [getLastReadTime])
  const { unreadCount, isLoading } = useUnreadCount(chatId, lastReadTime)

  return <>{children({ unreadCount, isLoading })}</>
}
