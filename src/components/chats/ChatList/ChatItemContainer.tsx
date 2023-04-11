import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'
import { ComponentProps, RefObject } from 'react'
import ChatItem from '../ChatItem'

export type ChatItemContainerProps = ComponentProps<'div'> & {
  post: PostData
  onSelectChatAsReply?: (chatId: string) => void
  scrollContainer?: RefObject<HTMLElement | null>
}
export default function ChatItemContainer({
  post,
  onSelectChatAsReply,
  scrollContainer,
  ...props
}: ChatItemContainerProps) {
  const address = useMyAccount((state) => state.address)
  if (!post?.content?.body) return null

  const ownerId = post.struct.ownerId
  const senderAddress = ownerId ?? ''

  const isMyMessage = address === senderAddress

  return (
    <div
      {...props}
      className={cx('w-10/12', isMyMessage && 'self-end', props.className)}
    >
      <ChatItem
        post={post}
        isMyMessage={isMyMessage}
        onSelectChatAsReply={onSelectChatAsReply}
        scrollContainer={scrollContainer}
      />
    </div>
  )
}
