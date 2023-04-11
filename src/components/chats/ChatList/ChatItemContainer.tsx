import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import ChatItem, { ChatItemProps } from '../ChatItem'

export type ChatItemContainerProps = Omit<ChatItemProps, 'isMyMessage'>

export default function ChatItemContainer({
  comment,
  onSelectChatAsReply,
  scrollContainer,
  ...props
}: ChatItemContainerProps) {
  const address = useMyAccount((state) => state.address)
  if (!comment?.content?.body) return null

  const ownerId = comment.struct.ownerId
  const senderAddress = ownerId ?? ''

  const isMyMessage = address === senderAddress

  return (
    <div
      {...props}
      className={cx('w-10/12', isMyMessage && 'self-end', props.className)}
    >
      <ChatItem
        comment={comment}
        isMyMessage={isMyMessage}
        onSelectChatAsReply={onSelectChatAsReply}
        scrollContainer={scrollContainer}
      />
    </div>
  )
}
