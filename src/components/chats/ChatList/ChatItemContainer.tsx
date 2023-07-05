import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import ChatItem, { ChatItemProps } from '../ChatItem'

export type ChatItemContainerProps = Omit<ChatItemProps, 'isMyMessage'> & {
  containerProps?: ComponentProps<'div'>
  chatId: string
  hubId: string
}

export default function ChatItemContainer({
  containerProps,
  chatId,
  hubId,
  ...props
}: ChatItemContainerProps) {
  const { message } = props
  const isMessageBlockedInCurrentHub = useIsMessageBlocked(
    hubId,
    message,
    chatId
  )
  const isMessageBlockedInOriginalHub = useIsMessageBlocked(
    message.struct.spaceId ?? '',
    message,
    chatId
  )
  const isMessageBlocked =
    isMessageBlockedInCurrentHub || isMessageBlockedInOriginalHub

  const address = useMyAccount((state) => state.address)

  if (isMessageBlocked) return null

  const ownerId = message.struct.ownerId
  const senderAddress = ownerId ?? ''

  const isMyMessage = address === senderAddress

  return (
    <div
      {...containerProps}
      className={cx(
        'w-11/12 md:w-8/12',
        isMyMessage && 'self-end',
        containerProps?.className
      )}
    >
      <ChatItem {...props} chatId={chatId} isMyMessage={isMyMessage} />
    </div>
  )
}
