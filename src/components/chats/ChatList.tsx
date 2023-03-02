import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import useInfiniteScrollData from '@/hooks/useInfiniteScrollData'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { getPostQuery } from '@/services/subsocial/posts'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/className'
import { PostData } from '@subsocial/api/types'
import {
  ComponentProps,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import InfiniteScroll from 'react-infinite-scroller'
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isInBottom = useRef(true)
  const [isScrolledToBottomFirstLoad, setIsScrolledToBottomFirstTime] =
    useState(false)

  const { data: commentIds = [] } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })
  const { currentData, hasMore, loadMore } = useInfiniteScrollData(
    commentIds,
    15,
    true
  )
  const posts = getPostQuery.useQueries(currentData)

  const Component = asContainer ? Container<'div'> : 'div'

  useLayoutEffect(() => {
    if (!isInBottom.current) return
    const chatRoom = scrollContainerRef.current
    chatRoom?.scrollTo({ top: chatRoom.scrollHeight })
    setIsScrolledToBottomFirstTime(true)
  }, [commentIds?.length])

  useEffect(() => {
    const chatRoom = scrollContainerRef.current
    const scrollListener = () => {
      if (!chatRoom) return
      isInBottom.current =
        chatRoom.scrollTop + chatRoom.clientHeight >= chatRoom.scrollHeight
    }
    chatRoom?.addEventListener('scroll', scrollListener, { passive: true })

    return () => {
      chatRoom?.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return (
    <ScrollableContainer
      {...props}
      as={Component}
      ref={scrollContainerRef}
      className={scrollableContainerClassName}
    >
      <InfiniteScroll
        isReverse
        useWindow={false}
        getScrollParent={() => scrollContainerRef.current}
        hasMore={isScrolledToBottomFirstLoad && hasMore}
        className={cx('relative flex flex-col gap-2 pt-10')}
        loadMore={loadMore}
      >
        <ChatLoading hasMore={hasMore} key='loading' />
        {posts.map(
          ({ data: post }) =>
            post && <ChatItemContainer post={post} key={post.id} />
        )}
      </InfiniteScroll>
    </ScrollableContainer>
  )
}

function ChatItemContainer({ post }: { post: PostData }) {
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

function ChatLoading({ hasMore }: { hasMore: boolean }) {
  return (
    <div className='absolute top-2 left-1/2 flex -translate-x-1/2 items-center gap-4'>
      {hasMore ? (
        <>
          <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-background-lighter' />
          <span className='text-sm text-text-muted'>Loading...</span>
        </>
      ) : (
        <span className='text-sm text-text-muted'>
          You have reached the first message in this topic!
        </span>
      )}
    </div>
  )
}
