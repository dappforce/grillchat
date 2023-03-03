import { cx } from '@/utils/className'
import { ComponentProps } from 'react'

export type ChatUnreadCountProps = ComponentProps<'div'> & {
  postId: string
}

export default function ChatUnreadCount({
  postId,
  ...props
}: ChatUnreadCountProps) {
  const unreadCount = 0
  if (unreadCount <= 0) return null

  return (
    <div
      className={cx(
        'rounded-full bg-background-primary py-0.5 px-2 text-sm',
        props.className
      )}
    >
      <span className='relative top-px'>{unreadCount}</span>
    </div>
  )
}
