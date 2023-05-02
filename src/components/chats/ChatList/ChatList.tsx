import useInfiniteScrollData from '@/components/chats/ChatList/hooks/useInfiniteScrollData'
import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import { CHAT_PER_PAGE } from '@/constants/chat'
import useWrapInRef from '@/hooks/useWrapInRef'
import { getPostQuery } from '@/services/api/query'
import { getBlockedIdsInRootPostIdQuery } from '@/services/moderation/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getChatPageLink } from '@/utils/links'
import { useRouter } from 'next/router'
import {
  ComponentProps,
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getChatItemId } from '../helpers'
import ChatItemContainer from './ChatItemContainer'
import ChatLoading from './ChatLoading'
import ChatTopNotice from './ChatTopNotice'
import useFocusedLastMessageId from './hooks/useFocusedLastMessageId'
import useIsAtBottom from './hooks/useIsAtBottom'
import useLoadMoreIfNoScroll from './hooks/useLoadMoreIfNoScroll'
import useScrollToChatElement from './hooks/useScrollToElement'
import { NewMessageNotice } from './NewMessageNotice'

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  postId: string
  scrollContainerRef?: React.RefObject<HTMLDivElement>
  replyTo?: string
  onSelectChatAsReply?: (chatId: string) => void
  newChatNoticeClassName?: string
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
  newChatNoticeClassName,
  ...props
}: ChatListProps) {
  const router = useRouter()
  const lastReadId = useFocusedLastMessageId(postId)

  const scrollableContainerId = useId()
  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef

  const innerRef = useRef<HTMLDivElement>(null)
  const isAtBottom = useIsAtBottom(scrollContainerRef, 100)

  const { data: commentIds = [] } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })

  const [isPausedLoadMore, setIsPausedLoadMore] = useState(false)
  const { currentData, loadMore } = useInfiniteScrollData(
    commentIds,
    CHAT_PER_PAGE,
    {
      reverse: true,
      isPausedLoadMore,
    }
  )

  const { data: blockedIds } = getBlockedIdsInRootPostIdQuery.useQuery(postId)
  const filteredIds = useMemo(() => {
    return currentData.filter((id) => !blockedIds?.includes(id))
  }, [blockedIds, currentData])

  const comments = getPostQuery.useQueries(filteredIds)
  const loadedComments = useMemo(() => {
    return comments.filter((post) => post.isLoading === false)
  }, [comments])

  useLoadMoreIfNoScroll(loadMore, loadedComments?.length ?? 0, {
    scrollContainer: scrollContainerRef,
    innerContainer: innerRef,
  })

  const scrollToChatElement = useScrollToChatElement(
    scrollContainerRef,
    {
      commentIds: currentData,
      commentsQuery: comments,
      loadedCommentsQuery: loadedComments,
      loadMore,
    },
    {
      pause: () => setIsPausedLoadMore(true),
      unpause: () => setIsPausedLoadMore(false),
    }
  )

  useEffect(() => {
    ;(async () => {
      const [, chatId] = router.query.topic as string[]
      if (!chatId) return

      await scrollToChatElement(chatId)
      router.replace(getChatPageLink(router), undefined, {
        shallow: true,
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isAtBottomRef = useWrapInRef(isAtBottom)
  useEffect(() => {
    if (!isAtBottomRef.current) return
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current?.scrollHeight,
      behavior: 'auto',
    })
  }, [loadedComments.length, isAtBottomRef, scrollContainerRef, replyTo])

  const Component = asContainer ? Container<'div'> : 'div'

  const isAllCommentsLoaded = loadedComments.length === commentIds.length

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
          'flex flex-col-reverse overflow-x-hidden pr-2 md:pr-4',
          scrollableContainerClassName
        )}
      >
        <div ref={innerRef}>
          <InfiniteScroll
            dataLength={loadedComments.length}
            next={loadMore}
            className={cx(
              'relative flex flex-col-reverse gap-2 !overflow-hidden pb-2'
            )}
            hasMore={!isAllCommentsLoaded}
            inverse
            scrollableTarget={scrollableContainerId}
            loader={<ChatLoading className='pb-2 pt-4' />}
            endMessage={<ChatTopNotice className='pb-2 pt-4' />}
            scrollThreshold={`${scrollThreshold}px`}
          >
            {comments.map(({ data: comment }, index) => {
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
                  chatBubbleId={getChatItemId(comment.id)}
                  scrollToChatElement={scrollToChatElement}
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
        className={cx('absolute bottom-0 right-6', newChatNoticeClassName)}
        commentIds={commentIds}
        scrollContainerRef={scrollContainerRef}
      />
    </Component>
  )
}
