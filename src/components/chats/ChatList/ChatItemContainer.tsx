import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { ComponentProps, forwardRef } from 'react'
import ChatItem, { ChatItemProps } from '../ChatItem'

export type ChatItemContainerProps = Omit<ChatItemProps, 'isMyMessage'> & {
  containerProps?: ComponentProps<'div'>
  chatId: string
  hubId: string
}

function ChatItemContainer(
  { containerProps, chatId, hubId, ...props }: ChatItemContainerProps,
  ref: any
) {
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

  const { content } = message
  const { body, extensions } = content || {}
  const address = useMyAccount((state) => state.address)

  if (isMessageBlocked || (!body && !extensions)) return null

  const ownerId = message.struct.ownerId
  const senderAddress = ownerId ?? ''

  const isMyMessage = address === senderAddress

  return (
    <div
      {...containerProps}
      ref={ref}
      className={cx(
        'w-11/12 md:w-8/12',
        isMyMessage && 'self-end',
        containerProps?.className
      )}
    >
      <ChatItem
        {...props}
        chatId={chatId}
        isMyMessage={isMyMessage}
        hubId={hubId}
      />
    </div>
  )
}

export default forwardRef(ChatItemContainer)
