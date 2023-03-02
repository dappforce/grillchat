import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import {
  getPostQuery,
  useCommentIdsByPostId,
} from '@/services/subsocial/queries'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/className'
import {
  ComponentProps,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import ChatItem from './ChatItem'

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  postId: string
}

// ChatListContent needs to use useLayoutEffect, so it can't run in server.
export default function ChatList(props: ChatListProps) {
  const [showChild, setShowChild] = useState(false)
  const isInitialized = useMyAccount((state) => state.isInitialized)

  useEffect(() => {
    if (isInitialized) setShowChild(true)
  }, [isInitialized])

  if (!showChild) {
    return null
  }

  return <ChatListContent {...props} />
}

function ChatListContent({
  asContainer,
  scrollableContainerClassName,
  postId,
  ...props
}: ChatListProps) {
  const id = useId()
  const isInBottom = useRef(true)

  const { data: commentIds = [] } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })

  const Component = asContainer ? Container<'div'> : 'div'

  useLayoutEffect(() => {
    if (!isInBottom.current) return
    const chatRoom = document.getElementById(id)
    chatRoom?.scrollTo({ top: chatRoom.scrollHeight })
  }, [id, commentIds?.length])

  useEffect(() => {
    const chatRoom = document.getElementById(id)
    const scrollListener = () => {
      if (!chatRoom) return
      isInBottom.current =
        chatRoom.scrollTop + chatRoom.clientHeight >= chatRoom.scrollHeight
    }
    chatRoom?.addEventListener('scroll', scrollListener, { passive: true })

    return () => {
      chatRoom?.removeEventListener('scroll', scrollListener)
    }
  }, [id])

  return (
    <ScrollableContainer
      {...props}
      as={Component}
      id={id}
      className={scrollableContainerClassName}
    >
      <div className={cx('flex flex-col gap-2')}>
        {commentIds.map((id) => (
          <ChatItemContainer id={id} key={id} />
        ))}
      </div>
    </ScrollableContainer>
  )
}

function ChatItemContainer({ id }: { id: string }) {
  const { data: post } = getPostQuery.useQuery(id)
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
