import { isOptimisticId } from '@/services/subsocial/utils'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import type { PostData } from '@subsocial/api/types'
import { ComponentProps } from 'react'
import ChatItem from '../ChatItem'

export type ChatItemContainerProps = ComponentProps<'div'> & {
  post: PostData
}
export default function ChatItemContainer({
  post,
  ...props
}: ChatItemContainerProps) {
  const address = useMyAccount((state) => state.address)
  if (!post?.content?.body) return null

  const ownerId = post.struct.ownerId
  const senderAddress = ownerId ?? ''

  const isMyMessage = address === senderAddress
  const isSent = !isOptimisticId(post.id)

  return (
    <div
      {...props}
      className={cx('w-10/12', isMyMessage && 'self-end', props.className)}
    >
      <ChatItem
        isMyMessage={isMyMessage}
        sentDate={post.struct.createdAtTime}
        senderAddress={senderAddress}
        text={post.content.body}
        isSent={isSent}
        blockNumber={post.struct.createdAtBlock}
        cid={post.struct.contentId}
      />
    </div>
  )
}
