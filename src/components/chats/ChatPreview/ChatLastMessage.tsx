import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import useLastMessage from './hooks/useLastMessage'

export type ChatLastMessageProps = ComponentProps<'div'> & {
  hubId: string
  chatId: string
  defaultDesc: string
}

export default function ChatLastMessage({
  hubId,
  chatId,
  defaultDesc,
  ...props
}: ChatLastMessageProps) {
  const { data: messageIds } = useCommentIdsByPostId(chatId)

  const { data: lastMessage } = useLastMessage(chatId)
  const isMessageBlocked = useIsMessageBlocked(hubId, lastMessage, chatId)
  const text = lastMessage?.content?.body || defaultDesc

  const defaultDescOrMessageCount =
    defaultDesc || `${messageIds?.length} messages`

  return (
    <p
      {...props}
      className={cx(
        'overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-text-muted',
        props.className
      )}
    >
      {isMessageBlocked ? defaultDescOrMessageCount : text}
    </p>
  )
}
