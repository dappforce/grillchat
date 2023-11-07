import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import { CHAT_PER_PAGE } from '@/constants/chat'
import useFilterBlockedMessageIds from '@/hooks/useFilterBlockedMessageIds'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getPostQuery } from '@/services/api/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useIsAnyQueriesLoading } from '@/subsocial-query'
import { cx } from '@/utils/class-names'
import { sendMessageToParentWindow } from '@/utils/window'
import {
  ComponentProps,
  createContext,
  RefObject,
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
import MemoizedChatItemWithMenu from './ChatItemWithMenu'
import ChatListEventManager from './ChatListEventManager'
import ChatListSupportingContent from './ChatListSupportingContent'
import ChatLoading from './ChatLoading'
import ChatTopNotice from './ChatTopNotice'
import useFocusedLastMessageId from './hooks/useFocusedLastMessageId'
import useLoadMoreIfNoScroll from './hooks/useLoadMoreIfNoScroll'
import useScrollToMessage from './hooks/useScrollToMessage'
import PinnedMessage from './PinnedMessage'

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
  const lastReadId = useFocusedLastMessageId(chatId)

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
  } = usePaginatedMessageIds({
    hubId,
    chatId,
    isPausedLoadMore,
  })

  const filteredCurrentPageIds = useFilterBlockedMessageIds(
    hubId,
    chatId,
    currentPageMessageIds
  )

  useEffect(() => {
    sendMessageToParentWindow('totalMessage', (totalDataCount ?? 0).toString())
  }, [totalDataCount])

  const [renderedMessageIds, setRenderedMessageIds] = useState<string[]>(
    filteredCurrentPageIds
  )
  const renderedMessageQueries = getPostQuery.useQueries(renderedMessageIds)
  const lastBatchIds = useMemo(
    () =>
      filteredCurrentPageIds.slice(
        filteredCurrentPageIds.length - CHAT_PER_PAGE
      ),
    [filteredCurrentPageIds]
  )
  const lastBatchQueries = getPostQuery.useQueries(lastBatchIds)
  const isLastBatchLoading = useIsAnyQueriesLoading(lastBatchQueries)
  useEffect(() => {
    if (isLastBatchLoading) return
    setRenderedMessageIds(() => {
      let newRenderedMessageIds = [...filteredCurrentPageIds]
      if (isLastBatchLoading) {
        newRenderedMessageIds = newRenderedMessageIds.slice(
          0,
          newRenderedMessageIds.length - CHAT_PER_PAGE
        )
      }

      return newRenderedMessageIds
    })
  }, [isLastBatchLoading, filteredCurrentPageIds])

  useLoadMoreIfNoScroll(loadMore, renderedMessageIds?.length ?? 0, {
    scrollContainer: scrollContainerRef,
    innerContainer: innerRef,
  })

  const pinnedMessageId = usePinnedMessage(chatId)
  const scrollToMessage = useScrollToMessage(
    scrollContainerRef,
    {
      // need to provide all the ids, including blocked ones
      messageIds: currentPageMessageIds,
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
                filteredCurrentPageIds.length === 0 ? null : (
                  <ChatTopNotice className='pb-2 pt-4' />
                )
              }
              scrollThreshold={`${SCROLL_THRESHOLD}px`}
            >
              {renderedMessageQueries.map(({ data: message }, index) => {
                // bottom message is the first element, because the flex direction is reversed
                const isBottomMessage = index === 0
                return (
                  <MemoizedChatItemWithMenu
                    key={message?.id ?? index}
                    chatItemClassName='mt-2'
                    chatId={chatId}
                    hubId={hubId}
                    isBottomMessage={isBottomMessage}
                    message={message}
                    scrollToMessage={scrollToMessage}
                    lastReadId={lastReadId}
                  />
                )
              })}
            </InfiniteScroll>
          </Component>
        </ScrollableContainer>

        <ChatListSupportingContent
          chatId={chatId}
          hubId={hubId}
          renderedMessageLength={renderedMessageIds.length}
          filteredMessageIds={[]}
          rawMessageIds={[]}
          // filteredMessageIds={filteredMessageIds}
          // rawMessageIds={rawMessageIds}
          scrollContainerRef={scrollContainerRef}
          scrollToMessage={scrollToMessage}
          asContainer={asContainer}
          newMessageNoticeClassName={newMessageNoticeClassName}
        />
      </div>
    </ChatListContext.Provider>
  )
}
