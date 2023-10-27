import useLastReadMessageIdFromStorage from '@/hooks/useLastReadMessageId'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { cx } from '@/utils/class-names'
import { ComponentProps, useMemo } from 'react'

export type ChatUnreadCountProps = ComponentProps<'div'> & {
  chatId: string
}

export default function ChatUnreadCount({
  chatId,
  ...props
}: ChatUnreadCountProps) {
  const { getLastReadMessageId } = useLastReadMessageIdFromStorage(chatId)
  const { data: messageIds } = useCommentIdsByPostId(chatId)

  const lastReadId = getLastReadMessageId()
  const unreadCount = useMemo(() => {
    const messagesLength = messageIds?.length
    if (!lastReadId || !messagesLength || messagesLength === 0) return 0
    const lastReadIndex = messageIds?.findIndex((id) => id === lastReadId)
    if (lastReadIndex === -1) return 0
    return messagesLength - 1 - lastReadIndex
  }, [messageIds, lastReadId])

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
