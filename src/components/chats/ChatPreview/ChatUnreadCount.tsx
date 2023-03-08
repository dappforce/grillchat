import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { cx } from '@/utils/className'
import { ComponentProps, useMemo } from 'react'

export type ChatUnreadCountProps = ComponentProps<'div'> & {
  postId: string
}

export default function ChatUnreadCount({
  postId,
  ...props
}: ChatUnreadCountProps) {
  const { getLastReadMessageId } = useLastReadMessageId(postId)
  const { data: commentIds } = useCommentIdsByPostId(postId)

  const lastReadId = getLastReadMessageId()
  const unreadCount = useMemo(() => {
    const commentLength = commentIds?.length
    if (!lastReadId || !commentLength || commentLength === 0) return 0
    const lastReadIndex = commentIds?.findIndex((id) => id === lastReadId)
    if (lastReadIndex === -1) return 0
    return commentLength - 1 - lastReadIndex
  }, [commentIds, lastReadId])

  if (unreadCount <= 0) return null

  return (
    <div
      className={cx(
        'rounded-full bg-background-primary py-0.5 px-2 text-sm',
        props.className
      )}
    >
      <span className='relative'>{unreadCount}</span>
    </div>
  )
}
