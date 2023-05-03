import useInfiniteScrollData from '@/components/chats/ChatList/hooks/useInfiniteScrollData'
import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import { CHAT_PER_PAGE } from '@/constants/chat'
import useWrapInRef from '@/hooks/useWrapInRef'
import { getPostQuery } from '@/services/api/query'
import { getBlockedMessageIdsInChatIdQuery } from '@/services/moderation/query'
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
import { getMessageElementId } from '../helpers'
import ChatItemContainer from './ChatItemContainer'
import ChatLoading from './ChatLoading'
import ChatTopNotice from './ChatTopNotice'
import useFocusedLastMessageId from './hooks/useFocusedLastMessageId'
import useIsAtBottom from './hooks/useIsAtBottom'
import useLoadMoreIfNoScroll from './hooks/useLoadMoreIfNoScroll'
import useScrollToMessage from './hooks/useScrollToMessage'
import { NewMessageNotice } from './NewMessageNotice'

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  chatId: string
  scrollContainerRef?: React.RefObject<HTMLDivElement>
  replyTo?: string
  onSelectMessageAsReply?: (chatId: string) => void
  newMessageNoticeClassName?: string
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
  chatId,
  scrollContainerRef: _scrollContainerRef,
  replyTo,
  onSelectMessageAsReply,
  newMessageNoticeClassName,
  ...props
}: ChatListProps) {
  const router = useRouter()
  const lastReadId = useFocusedLastMessageId(chatId)

  const scrollableContainerId = useId()
  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef

  const innerRef = useRef<HTMLDivElement>(null)
  const isAtBottom = useIsAtBottom(scrollContainerRef, 100)

  const { data: messageIds = [] } = useCommentIdsByPostId(chatId, {
    subscribe: true,
  })

  const [isPausedLoadMore, setIsPausedLoadMore] = useState(false)
  const { currentData: currentPageMessageIds, loadMore } =
    useInfiniteScrollData(messageIds, CHAT_PER_PAGE, isPausedLoadMore)

  const { data: blockedIds } =
    getBlockedMessageIdsInChatIdQuery.useQuery(chatId)
  const filteredIds = useMemo(() => {
    return currentPageMessageIds.filter((id) => !blockedIds?.includes(id))
  }, [blockedIds, currentPageMessageIds])

  const messageQueries = getPostQuery.useQueries(filteredIds)
  const loadedMessageQueries = useMemo(() => {
    return messageQueries.filter((post) => post.isLoading === false)
  }, [messageQueries])

  useLoadMoreIfNoScroll(loadMore, loadedMessageQueries?.length ?? 0, {
    scrollContainer: scrollContainerRef,
    innerContainer: innerRef,
  })

  const scrollToChatElement = useScrollToMessage(
    scrollContainerRef,
    {
      messageIds: currentPageMessageIds,
      messageQueries,
      loadedMessageQueries,
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
  }, [loadedMessageQueries.length, isAtBottomRef, scrollContainerRef, replyTo])

  const Component = asContainer ? Container<'div'> : 'div'

  const isAllMessagesLoaded = loadedMessageQueries.length === messageIds.length

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
            dataLength={loadedMessageQueries.length}
            next={loadMore}
            className={cx(
              'relative flex flex-col-reverse gap-2 !overflow-hidden pb-2'
            )}
            hasMore={!isAllMessagesLoaded}
            inverse
            scrollableTarget={scrollableContainerId}
            loader={<ChatLoading className='pb-2 pt-4' />}
            endMessage={<ChatTopNotice className='pb-2 pt-4' />}
            scrollThreshold={`${scrollThreshold}px`}
          >
            {messageQueries.map(({ data: message }, index) => {
              const isLastReadMessage = lastReadId === message?.id
              // bottom message is the first element, because the flex direction is reversed
              const isBottomMessage = index === 0
              const showLastUnreadMessageNotice =
                isLastReadMessage && !isBottomMessage

              const chatElement = message && (
                <ChatItemContainer
                  chatId={chatId}
                  onSelectMessageAsReply={onSelectMessageAsReply}
                  message={message}
                  key={message.id}
                  messageBubbleId={getMessageElementId(message.id)}
                  scrollToMessage={scrollToChatElement}
                />
              )
              if (!showLastUnreadMessageNotice) return chatElement

              return (
                <Fragment key={message?.id || index}>
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
        className={cx('absolute bottom-0 right-6', newMessageNoticeClassName)}
        messageIds={messageIds}
        scrollContainerRef={scrollContainerRef}
      />
    </Component>
  )
}
