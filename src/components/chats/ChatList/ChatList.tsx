import useInfiniteScrollData from '@/components/chats/ChatList/hooks/useInfiniteScrollData'
import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { getPostQuery } from '@/services/subsocial/posts'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/className'
import { ComponentProps, useEffect, useId, useMemo, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ChatItemContainer from './ChatItemContainer'
import ChatLoading from './ChatLoading'
import ChatTopNotice from './ChatTopNotice'
import useFocusedLastMessageId from './hooks/useFocusedLastMessageId'
import { NewMessageNotice } from './NewMessageNotice'

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
  const lastReadId = useFocusedLastMessageId(postId)

  const scrollableContainerId = useId()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  const { data: commentIds = [] } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })
  const { currentData, loadMore } = useInfiniteScrollData(commentIds, 15, true)
  const posts = getPostQuery.useQueries(currentData)
  const loadedPost = useMemo(() => {
    return posts.filter((post) => post.isLoading === false)
  }, [posts])

  useEffect(() => {
    const inner = innerRef.current
    const scrollContainer = scrollContainerRef.current
    if (inner && scrollContainer) {
      const innerHeight = inner.clientHeight
      const scrollContainerHeight = scrollContainer.scrollHeight
      if (innerHeight < scrollContainerHeight) {
        loadMore()
      }
    }
  }, [loadedPost.length, loadMore])

  const Component = asContainer ? Container<'div'> : 'div'

  const isAllPostsLoaded = loadedPost.length === commentIds.length

  return (
    <Component
      {...props}
      className={cx(
        'relative flex flex-1 flex-col overflow-hidden',
        props.className
      )}
    >
      <ScrollableContainer
        id={scrollableContainerId}
        ref={scrollContainerRef}
        className={cx('flex flex-col-reverse', scrollableContainerClassName)}
      >
        <div ref={innerRef}>
          <InfiniteScroll
            dataLength={loadedPost.length}
            next={loadMore}
            className={cx(
              'relative flex flex-col-reverse gap-2 overflow-hidden'
            )}
            hasMore={!isAllPostsLoaded}
            inverse
            scrollableTarget={scrollableContainerId}
            loader={<ChatLoading className='pb-2 pt-4' />}
            endMessage={<ChatTopNotice className='pb-2 pt-4' />}
            scrollThreshold='200px'
          >
            {posts.map(({ data: post }, index) => {
              const isLastReadMessage = lastReadId === post?.id
              // bottom message is the first element, because the flex direction is reversed
              const isBottomMessage = index === 0
              const showLastUnreadMessageNotice =
                isLastReadMessage && !isBottomMessage

              const chatElement = post && (
                <ChatItemContainer post={post} key={post.id} />
              )
              if (!showLastUnreadMessageNotice) return chatElement

              return (
                <>
                  <div className='my-2 w-full rounded-md bg-background-light py-0.5 text-center text-sm'>
                    Unread messages
                  </div>
                  {chatElement}
                </>
              )
            })}
          </InfiniteScroll>
        </div>
      </ScrollableContainer>
      <NewMessageNotice
        className='absolute bottom-0 right-8'
        commentIds={commentIds}
        scrollContainerRef={scrollContainerRef}
      />
    </Component>
  )
}
