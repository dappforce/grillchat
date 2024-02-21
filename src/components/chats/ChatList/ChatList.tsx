import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import { CHAT_PER_PAGE } from '@/constants/chat'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getPostQuery } from '@/services/api/query'
import { getSuperLikeCountQuery } from '@/services/datahub/content-staking/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useIsAnyQueriesLoading } from '@/subsocial-query'
import { cx } from '@/utils/class-names'
import { sendMessageToParentWindow } from '@/utils/window'
import {
  ComponentProps,
  Fragment,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import usePaginatedMessageIds from '../hooks/usePaginatedMessageIds'
import usePinnedMessage from '../hooks/usePinnedMessage'
import CenterChatNotice from './CenterChatNotice'
import ChatItemWithMenu from './ChatItemWithMenu'
import ChatListEventManager from './ChatListEventManager'
import ChatListSupportingContent from './ChatListSupportingContent'
import ChatLoading from './ChatLoading'
import ChatTopNotice from './ChatTopNotice'
import PinnedMessage from './PinnedMessage'
import useLastFocusedMessageTime from './hooks/useLastFocusedMessageId'
import useLoadMoreIfNoScroll from './hooks/useLoadMoreIfNoScroll'
import useScrollToMessage from './hooks/useScrollToMessage'

const ChatListContext = createContext<RefObject<HTMLDivElement> | null>(null)
export function useChatListContext() {
  return useContext(ChatListContext)
}

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollContainerRef?: React.RefObject<HTMLDivElement>
  scrollableContainerClassName?: string
  hubId: string
  chatId: string
  newMessageNoticeClassName?: string
}

export default function ChatList(props: ChatListProps) {
  const isInitialized = useMyAccount((state) => state.isInitialized)
  return (
    <ChatListContent
      key={props.chatId}
      {...props}
      className={cx(!isInitialized && 'opacity-0', props.className)}
    />
  )
}

// If using bigger threshold, the scroll will be janky, but if using 0 threshold, it sometimes won't trigger `next` callback
const SCROLL_THRESHOLD = 20

function ChatListContent({
  asContainer,
  scrollableContainerClassName,
  hubId,
  chatId,
  scrollContainerRef: _scrollContainerRef,
  newMessageNoticeClassName,
  ...props
}: ChatListProps) {
  const sendEvent = useSendEvent()
  const { enableBackButton } = useConfigContext()

  const scrollableContainerId = useId()

  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef

  const innerRef = useRef<HTMLDivElement>(null)

  const [isPausedLoadMore, setIsPausedLoadMore] = useState(false)
  const {
    currentPageMessageIds,
    hasMore,
    loadMore,
    totalDataCount,
    currentPage,
    isLoading,
  } = usePaginatedMessageIds({
    hubId,
    chatId,
    isPausedLoadMore,
  })
  const lastFocusedTime = useLastFocusedMessageTime(
    chatId,
    currentPageMessageIds[0] ?? ''
  )

  useEffect(() => {
    sendMessageToParentWindow('totalMessage', (totalDataCount ?? 0).toString())
  }, [totalDataCount])

  const [renderedMessageIds, setRenderedMessageIds] = useState<string[]>(
    currentPageMessageIds
  )
  const renderedMessageQueries = getPostQuery.useQueries(renderedMessageIds)
  const lastBatchIds = useMemo(
    () =>
      currentPageMessageIds.slice(currentPageMessageIds.length - CHAT_PER_PAGE),
    [currentPageMessageIds]
  )

  const lastBatchQueries = getPostQuery.useQueries(lastBatchIds)
  const superLikeCountQueries = getSuperLikeCountQuery.useQueries(lastBatchIds)

  const isLastBatchLoading = useIsAnyQueriesLoading([
    ...lastBatchQueries,
    ...superLikeCountQueries,
  ])

  useEffect(() => {
    if (isLastBatchLoading) return
    setRenderedMessageIds(() => {
      let newRenderedMessageIds = [...currentPageMessageIds]
      if (isLastBatchLoading) {
        newRenderedMessageIds = newRenderedMessageIds.slice(
          0,
          newRenderedMessageIds.length - CHAT_PER_PAGE
        )
      }

      return newRenderedMessageIds
    })
  }, [isLastBatchLoading, currentPageMessageIds])

  useLoadMoreIfNoScroll(loadMore, renderedMessageIds?.length ?? 0, {
    scrollContainer: scrollContainerRef,
    innerContainer: innerRef,
  })

  const pinnedMessageId = usePinnedMessage(chatId)
  const scrollToMessage = useScrollToMessage(
    scrollContainerRef,
    {
      renderedMessageIds,
      loadMore,
      isLoading: isLastBatchLoading,
      hasMore,
    },
    {
      pause: () => setIsPausedLoadMore(true),
      unpause: () => setIsPausedLoadMore(false),
    },
    {
      scrollOffset: pinnedMessageId ? 'large' : 'normal',
    }
  )

  const myAddress = useMyMainAddress()
  const { data: chat } = getPostQuery.useQuery(chatId)
  const isMyChat = chat?.struct.ownerId === myAddress

  const Component = asContainer ? Container<'div'> : 'div'

  const isAllMessagesLoaded = renderedMessageIds.length === totalDataCount
  let alreadyRenderLastReadMessage = false

  return (
    <ChatListContext.Provider value={scrollContainerRef}>
      <ChatListEventManager />
      <div
        {...props}
        className={cx(
          'relative flex flex-1 flex-col overflow-hidden',
          props.className
        )}
      >
        <PinnedMessage
          scrollToMessage={scrollToMessage}
          chatId={chatId}
          asContainer={asContainer}
        />
        {totalDataCount === 0 && (
          <CenterChatNotice
            isMyChat={isMyChat}
            className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2'
          />
        )}
        <ScrollableContainer
          id={scrollableContainerId}
          ref={scrollContainerRef}
          className={cx(
            'flex flex-col-reverse overflow-x-hidden overflow-y-scroll pl-2',
            scrollableContainerClassName
          )}
        >
          <Component
            ref={innerRef}
            className={cx(enableBackButton === false && 'px-0')}
          >
            <InfiniteScroll
              dataLength={renderedMessageIds.length}
              next={() => {
                loadMore()
                sendEvent('load_more_messages', { currentPage })
              }}
              className={cx(
                'relative flex flex-col-reverse !overflow-hidden pb-2',
                // need to have enough room to open message menu
                'min-h-[400px]'
              )}
              hasMore={!isAllMessagesLoaded}
              inverse
              scrollableTarget={scrollableContainerId}
              loader={<ChatLoading className='pb-2 pt-4' />}
              endMessage={
                currentPageMessageIds.length === 0 ? null : (
                  <ChatTopNotice className='pb-2 pt-4' />
                )
              }
              scrollThreshold={`${SCROLL_THRESHOLD}px`}
            >
              {renderedMessageQueries.map(({ data: message }, index) => {
                // bottom message is the first element, because the flex direction is reversed
                if (!message) return null

                const isBottomMessage = index === 0
                const isMessageRead =
                  lastFocusedTime >= message.struct.createdAtTime
                // Only show the unread message notice for first message that is marked as read
                const currentAlreadyRenderLastReadMessage =
                  alreadyRenderLastReadMessage
                if (isMessageRead) {
                  alreadyRenderLastReadMessage = true
                }

                const shouldRenderUnreadMessageNotice =
                  !isBottomMessage &&
                  !currentAlreadyRenderLastReadMessage &&
                  isMessageRead

                return (
                  <Fragment key={message?.id ?? index}>
                    {shouldRenderUnreadMessageNotice && (
                      <div className='mb-2 mt-4 w-full rounded-md bg-background-light py-0.5 text-center text-sm'>
                        Unread messages
                      </div>
                    )}
                    <ChatItemWithMenu
                      chatItemClassName='mt-2'
                      chatId={chatId}
                      hubId={hubId}
                      message={message}
                      scrollToMessage={scrollToMessage}
                    />
                  </Fragment>
                )
              })}
            </InfiniteScroll>
          </Component>
        </ScrollableContainer>

        <ChatListSupportingContent
          chatId={chatId}
          hubId={hubId}
          isLoadingIds={isLoading}
          renderedMessageIds={renderedMessageIds}
          scrollContainerRef={scrollContainerRef}
          scrollToMessage={scrollToMessage}
          asContainer={asContainer}
          newMessageNoticeClassName={newMessageNoticeClassName}
        />
      </div>
    </ChatListContext.Provider>
  )
}
