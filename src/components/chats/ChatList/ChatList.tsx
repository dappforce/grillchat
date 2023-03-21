import useInfiniteScrollData from '@/components/chats/ChatList/hooks/useInfiniteScrollData'
import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import { CHAT_PER_PAGE } from '@/constants/chat'
import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import {
  ComponentProps,
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ChatItemContainer from './ChatItemContainer'
import ChatLoading from './ChatLoading'
import ChatTopNotice from './ChatTopNotice'
import useFocusedLastMessageId from './hooks/useFocusedLastMessageId'
import useIsAtBottom from './hooks/useIsAtBottom'
import { NewMessageNotice } from './NewMessageNotice'

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  postId: string
  scrollContainerRef?: React.RefObject<HTMLDivElement>
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
  scrollContainerRef: _scrollContainerRef,
  ...props
}: ChatListProps) {
  const lastReadId = useFocusedLastMessageId(postId)

  const scrollableContainerId = useId()
  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef

  const innerRef = useRef<HTMLDivElement>(null)
  const isAtBottom = useIsAtBottom(scrollContainerRef, 100)

  const { data: commentIds = [] } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })
  const { currentData, loadMore } = useInfiniteScrollData(
    commentIds,
    CHAT_PER_PAGE,
    true
  )
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
  }, [loadedPost.length, loadMore, scrollContainerRef])

  useEffect(() => {
    if (!isAtBottom) return
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current?.scrollHeight,
      behavior: 'auto',
    })
  }, [isAtBottom, loadedPost.length, scrollContainerRef])

  const Component = asContainer ? Container<'div'> : 'div'

  const isAllPostsLoaded = loadedPost.length === commentIds.length

  const scrollThreshold =
    (scrollContainerRef.current?.scrollHeight ?? 0) * 0.35 || 500

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
        className={cx(
          'flex flex-col-reverse pr-4',
          scrollableContainerClassName
        )}
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
            scrollThreshold={`${scrollThreshold}px`}
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
                <Fragment key={post?.id || index}>
                  <div className='my-2 w-full rounded-md bg-background-light py-0.5 text-center text-sm'>
                    Unread messages
                  </div>
                  {chatElement}
                </Fragment>
              )
            })}
          </InfiniteScroll>
        </div>
      </ScrollableContainer>
      <NewMessageNotice
        className='absolute bottom-0 right-6'
        commentIds={commentIds}
        scrollContainerRef={scrollContainerRef}
      />
    </Component>
  )
}
