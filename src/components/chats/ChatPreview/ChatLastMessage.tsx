import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import useLastMessage from './hooks/useLastMessage'

export type ChatLastMessageProps = ComponentProps<'div'> & {
  postId: string
  defaultDesc: string
}

export default function ChatLastMessage({
  postId,
  defaultDesc,
  ...props
}: ChatLastMessageProps) {
  const { data: lastMessage } = useLastMessage(postId)
  const isMessageBlocked = useIsMessageBlocked(lastMessage, postId)
  const text = lastMessage?.content?.body || defaultDesc

  return (
    <p
      {...props}
      className={cx(
        'overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-text-muted',
        props.className
      )}
    >
      {isMessageBlocked ? '<blocked>' : text}
    </p>
  )
}
