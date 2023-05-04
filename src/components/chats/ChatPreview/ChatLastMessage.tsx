import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import useLastMessage from './hooks/useLastMessage'

export type ChatLastMessageProps = ComponentProps<'div'> & {
  chatId: string
  defaultDesc: string
}

export default function ChatLastMessage({
  chatId,
  defaultDesc,
  ...props
}: ChatLastMessageProps) {
  const { data: lastMessage } = useLastMessage(chatId)
  const isMessageBlocked = useIsMessageBlocked(lastMessage, chatId)
  const text = lastMessage?.content?.body || defaultDesc

  return (
    <p
      {...props}
      className={cx(
        'overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-text-muted',
        props.className
      )}
    >
      {isMessageBlocked ? '<message moderated>' : text}
    </p>
  )
}
