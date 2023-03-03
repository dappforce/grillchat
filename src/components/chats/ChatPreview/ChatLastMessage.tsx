import { cx } from '@/utils/className'
import { ComponentProps } from 'react'

export type ChatLastMessageProps = ComponentProps<'div'> & {
  postId: string
}

export default function ChatLastMessage({
  postId,
  ...props
}: ChatLastMessageProps) {
  return (
    <p
      {...props}
      className={cx(
        'overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-text-muted',
        props.className
      )}
    >
      {'asdfasdf'}
    </p>
  )
}
