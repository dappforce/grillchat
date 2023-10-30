import useLastReadMessageIdFromStorage from '@/components/chats/hooks/useLastReadMessageId'
import useUnreadCount from '@/components/chats/hooks/useUnreadCount'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type ChatUnreadCountProps = ComponentProps<'div'> & {
  chatId: string
}

export default function ChatUnreadCount({
  chatId,
  ...props
}: ChatUnreadCountProps) {
  const { getLastReadMessageId } = useLastReadMessageIdFromStorage(chatId)
  const lastReadId = getLastReadMessageId() ?? ''
  const unreadCount = useUnreadCount(chatId, lastReadId)

  if (unreadCount <= 0) return null

  return (
    <div
      className={cx(
        'rounded-full bg-background-primary px-2 py-0.5 text-sm text-text-on-primary',
        props.className
      )}
    >
      <span className='relative'>{unreadCount}</span>
    </div>
  )
}
