import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import useInfiniteScrollData from '@/hooks/useInfiniteScrollData'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { getPostQuery } from '@/services/subsocial/posts'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/className'
import { PostData } from '@subsocial/api/types'
import { ComponentProps, useEffect, useId, useMemo, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ChatItem from './ChatItem'

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  postId: string
}

export default function ChatList(props: ChatListProps) {
  const isInitialized = useMyAccount((state) => state.isInitialized)
  if (!isInitialized) return null
  return <ChatListContent {...props} />
}

function ChatListContent({
  asContainer,
  scrollableContainerClassName,
  postId,
  ...props
}: ChatListProps) {
  const scrollableContainerId = useId()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isInBottom = useRef(true)

  const { data: commentIds = [] } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })
  const { currentData, loadMore } = useInfiniteScrollData(commentIds, 15, true)
  const posts = getPostQuery.useQueries(currentData)
  const loadedPost = useMemo(() => {
    return posts.filter((post) => post.isLoading === false)
  }, [posts])

  const Component = asContainer ? Container<'div'> : 'div'

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

  const isAllPostsLoaded = loadedPost.length === commentIds.length

  return (
    <ScrollableContainer
      {...props}
      id={scrollableContainerId}
      as={Component}
      ref={scrollContainerRef}
      className={cx('flex flex-col-reverse', scrollableContainerClassName)}
    >
      <InfiniteScroll
        dataLength={loadedPost.length}
        next={loadMore}
        className={cx('relative flex flex-col-reverse gap-2 overflow-hidden')}
        hasMore={!isAllPostsLoaded}
        inverse
        scrollableTarget={scrollableContainerId}
        loader={<ChatLoading />}
      >
        {posts.map(
          ({ data: post }) =>
            post && <ChatItemContainer post={post} key={post.id} />
        )}
        {isAllPostsLoaded && <ChatTopNotice />}
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

function ChatLoading() {
  return (
    <div className='flex items-center justify-center gap-4 overflow-hidden py-2'>
      <div className='relative h-4 w-4'>
        <div className='absolute inset-0 h-4 w-4 animate-spin rounded-full border-b-2 border-background-lighter' />
      </div>
      <span className='text-sm text-text-muted'>Loading...</span>
    </div>
  )
}

function ChatTopNotice() {
  return (
    <div className='flex justify-center py-2'>
      <span className='text-sm text-text-muted'>
        You have reached the first message in this topic!
      </span>
    </div>
  )
}
