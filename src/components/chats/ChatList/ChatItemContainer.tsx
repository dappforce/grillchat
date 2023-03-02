import { isOptimisticId } from '@/services/subsocial/utils'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/className'
import { PostData } from '@subsocial/api/types'
import ChatItem from '../ChatItem'

export default function ChatItemContainer({ post }: { post: PostData }) {
  const address = useMyAccount((state) => state.address)
  if (!post?.content?.body) return null

  const isSent = !isOptimisticId(post.id)
  const ownerId = post.struct.ownerId
  const isMyMessage = address === ownerId

  return (
    <div className={cx('w-10/12', isMyMessage && 'self-end')}>
      <ChatItem
        isMyMessage={isMyMessage}
        sentDate={post.struct.createdAtTime}
        senderAddress={ownerId}
        text={post.content.body}
        isSent={isSent}
      />
    </div>
  )
}
