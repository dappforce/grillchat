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
import { getChatItemId } from './helpers'
import useFocusedLastMessageId from './hooks/useFocusedLastMessageId'
import useIsAtBottom from './hooks/useIsAtBottom'
import useLoadMoreIfNoScroll from './hooks/useLoadMoreIfNoScroll'
import { NewMessageNotice } from './NewMessageNotice'

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  postId: string
  scrollContainerRef?: React.RefObject<HTMLDivElement>
  replyTo?: string
  onSelectChatAsReply?: (chatId: string) => void
}

export default function ChatList(props: ChatListProps) {
  const isInitialized = useMyAccount((state) => state.isInitialized)
  if (!isInitialized) return null
  return <ChatListContent {...props} />
}

const SCROLL_THRESHOLD_PERCENTAGE = 0.35
const DEFAULT_SCROLL_THRESHOLD = 500

function ChatListContent({
  asContainer,
  scrollableContainerClassName,
  postId,
  scrollContainerRef: _scrollContainerRef,
  replyTo,
  onSelectChatAsReply,
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

  useLoadMoreIfNoScroll(loadMore, loadedPost?.length ?? 0, {
    scrollContainer: scrollContainerRef,
    innerContainer: innerRef,
  })

  useEffect(() => {
    if (!isAtBottom) return
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current?.scrollHeight,
      behavior: 'auto',
    })
  }, [isAtBottom, loadedPost.length, scrollContainerRef, replyTo])

  const Component = asContainer ? Container<'div'> : 'div'

  const isAllPostsLoaded = loadedPost.length === commentIds.length

  const scrollThreshold =
    (scrollContainerRef.current?.scrollHeight ?? 0) *
      SCROLL_THRESHOLD_PERCENTAGE || DEFAULT_SCROLL_THRESHOLD

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
          'flex flex-col-reverse pr-4 overflow-x-hidden',
          scrollableContainerClassName
        )}
      >
        <div ref={innerRef}>
          <InfiniteScroll
            dataLength={loadedPost.length}
            next={loadMore}
            className={cx(
              'relative flex flex-col-reverse gap-2 !overflow-hidden'
            )}
            hasMore={!isAllPostsLoaded}
            inverse
            scrollableTarget={scrollableContainerId}
            loader={<ChatLoading className='pb-2 pt-4' />}
            endMessage={<ChatTopNotice className='pb-2 pt-4' />}
            scrollThreshold={`${scrollThreshold}px`}
          >
            {posts.map(({ data: comment }, index) => {
              const isLastReadMessage = lastReadId === comment?.id
              // bottom message is the first element, because the flex direction is reversed
              const isBottomMessage = index === 0
              const showLastUnreadMessageNotice =
                isLastReadMessage && !isBottomMessage

              const chatElement = comment && (
                <ChatItemContainer
                  onSelectChatAsReply={onSelectChatAsReply}
                  comment={comment}
                  key={comment.id}
                  scrollContainer={scrollContainerRef}
                  chatBubbleId={getChatItemId(comment.id)}
                />
              )
              if (!showLastUnreadMessageNotice) return chatElement

              return (
                <Fragment key={comment?.id || index}>
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
