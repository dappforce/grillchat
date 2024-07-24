import Container from '@/components/Container'
import Loading from '@/components/Loading'
import ScrollableContainer from '@/components/ScrollableContainer'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { sendMessageToParentWindow } from '@/utils/window'
import { ComponentProps, Fragment, useEffect, useId, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ProfilePostsListModal from '../ChatItem/profilePosts/ProfileProstsListModal'
import usePaginatedMessageIds from '../hooks/usePaginatedMessageIds'
import usePinnedMessage from '../hooks/usePinnedMessage'
import CenterChatNotice from './CenterChatNotice'
import ChatItemWithMenu from './ChatItemWithMenu'
import ChatListEventManager from './ChatListEventManager'
import ChatListSupportingContent from './ChatListSupportingContent'
import ChatTopNotice from './ChatTopNotice'
import PinnedMessage from './PinnedMessage'
import useLastFocusedMessageTime from './hooks/useLastFocusedMessageId'
import useScrollToMessage from './hooks/useScrollToMessage'
import { ChatListContext } from './provider'

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollContainerRef?: React.RefObject<HTMLDivElement>
  scrollableContainerClassName?: string
  hubId: string
  disableSuperLike?: boolean
  chatId: string
  onlyDisplayUnapprovedMessages?: boolean
  newMessageNoticeClassName?: string
  topElement?: React.ReactNode
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
  disableSuperLike,
  newMessageNoticeClassName,
  onlyDisplayUnapprovedMessages,
  ...props
}: ChatListProps) {
  const sendEvent = useSendEvent()
  const { enableBackButton } = useConfigContext()
  const { data: postMetadata } = getPostMetadataQuery.useQuery(chatId)

  const scrollableContainerId = useId()

  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef

  const innerRef = useRef<HTMLDivElement>(null)

  const {
    messageIds,
    hasMore,
    loadMore,
    unfilteredMessageIds,
    totalDataCount,
    currentPage,
    isLoading,
  } = usePaginatedMessageIds({
    hubId,
    chatId,
    onlyDisplayUnapprovedMessages,
  })

  const filteredIdsCount = messageIds.length
  const unfilteredIdsCount = unfilteredMessageIds.length
  useEffect(() => {
    if (!scrollContainerRef.current) return
    if (
      scrollContainerRef.current.scrollHeight <=
      scrollContainerRef.current.clientHeight
    ) {
      loadMore()
    }
  }, [filteredIdsCount, unfilteredIdsCount, loadMore, scrollContainerRef])

  const lastFocusedTime = useLastFocusedMessageTime(chatId, messageIds[0] ?? '')

  useEffect(() => {
    sendMessageToParentWindow('totalMessage', (totalDataCount ?? 0).toString())
  }, [totalDataCount])

  const pinnedMessageId = usePinnedMessage(chatId)
  const scrollToMessage = useScrollToMessage(
    scrollContainerRef,
    {
      renderedMessageIds: messageIds,
      loadMore,
      isLoading,
      hasMore,
    },
    undefined,
    {
      scrollOffset: pinnedMessageId ? 'large' : 'normal',
    }
  )

  const myAddress = useMyMainAddress()
  const { data: chat } = getPostQuery.useQuery(chatId)
  const isMyChat = chat?.struct.ownerId === myAddress

  const Component = asContainer ? Container<'div'> : 'div'

  let alreadyRenderLastReadMessage = false
  let isFirstRenderedMessage = true

  const renderedMessageQueries = getPostQuery.useQueries(messageIds)

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
            customText={
              (postMetadata?.totalCommentsCount ?? 0) > 0 &&
              !onlyDisplayUnapprovedMessages
                ? 'Loading messages...'
                : undefined
            }
            className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2'
          />
        )}
        <ScrollableContainer
          id={scrollableContainerId}
          ref={scrollContainerRef}
          className={cx(
            'flex flex-col overflow-x-hidden overflow-y-scroll @container',
            scrollableContainerClassName
          )}
        >
          <Component
            ref={innerRef}
            className={cx(enableBackButton === false && 'px-0', 'flex')}
          >
            <div className='flex-1'>
              <InfiniteScroll
                dataLength={unfilteredMessageIds.length}
                next={() => {
                  loadMore()
                  sendEvent('load_more_messages', { currentPage })
                }}
                className={cx(
                  'relative flex w-full flex-col !overflow-hidden',
                  // need to have enough room to open message menu
                  'min-h-[400px]'
                )}
                hasMore={hasMore}
                scrollableTarget={scrollableContainerId}
                loader={<Loading className='pb-2 pt-4' />}
                endMessage={
                  renderedMessageQueries.length === 0 ? null : (
                    <ChatTopNotice className='pb-2 pt-4' />
                  )
                }
                scrollThreshold={`${SCROLL_THRESHOLD}px`}
              >
                {renderedMessageQueries.map(({ data: message }, index) => {
                  // bottom message is the first element, because the flex direction is reversed
                  if (!message) return null

                  const isBottomMessage = isFirstRenderedMessage
                  isFirstRenderedMessage = false

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
                        <div className='mb-2 mt-4 w-full rounded-md bg-background-light/50 py-0.5 text-center text-sm text-text-muted'>
                          Unread messages
                        </div>
                      )}
                      <ChatItemWithMenu
                        chatItemClassName='mt-2'
                        chatId={chatId}
                        hubId={hubId}
                        message={message}
                        disableSuperLike={disableSuperLike}
                        scrollToMessage={scrollToMessage}
                        showApproveButton={onlyDisplayUnapprovedMessages}
                      />
                    </Fragment>
                  )
                })}
              </InfiniteScroll>
            </div>
          </Component>
        </ScrollableContainer>

        <ChatListSupportingContent
          chatId={chatId}
          hubId={hubId}
          isLoadingIds={isLoading}
          renderedMessageIds={messageIds}
          scrollContainerRef={scrollContainerRef}
          scrollToMessage={scrollToMessage}
          asContainer={asContainer}
          newMessageNoticeClassName={newMessageNoticeClassName}
        />
      </div>
      <ProfilePostsListModal />
    </ChatListContext.Provider>
  )
}
