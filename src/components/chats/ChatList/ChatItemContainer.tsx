import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import ChatItem, { ChatItemProps } from '../ChatItem'

export type ChatItemContainerProps = Omit<ChatItemProps, 'isMyMessage'> & {
  containerProps?: ComponentProps<'div'>
}

export default function ChatItemContainer({
  containerProps,
  ...props
}: ChatItemContainerProps) {
  const { comment } = props
  const address = useMyAccount((state) => state.address)
  if (!comment?.content?.body) return null

  const ownerId = comment.struct.ownerId
  const senderAddress = ownerId ?? ''

  const isMyMessage = address === senderAddress

  return (
    <div
      {...containerProps}
      className={cx(
        'w-11/12 md:w-10/12',
        isMyMessage && 'self-end',
        containerProps?.className
      )}
    >
      <ChatItem {...props} isMyMessage={isMyMessage} />
    </div>
  )
}
