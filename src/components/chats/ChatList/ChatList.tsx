import useInfiniteScrollData from '@/components/chats/ChatList/hooks/useInfiniteScrollData'
import Container from '@/components/Container'
import MessageModal from '@/components/modals/MessageModal'
import ScrollableContainer from '@/components/ScrollableContainer'
import { CHAT_PER_PAGE } from '@/constants/chat'
import useFilterBlockedMessageIds from '@/hooks/useFilterBlockedMessageIds'
import usePrevious from '@/hooks/usePrevious'
import useWrapInRef from '@/hooks/useWrapInRef'
import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getChatPageLink, getUrlQuery } from '@/utils/links'
import { validateNumber } from '@/utils/strings'
import { replaceUrl } from '@/utils/window'
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
import urlJoin from 'url-join'
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
  const [messageModalMsgId, setMessageModalMsgId] = useState('')
  const prevMessageModalMsgId = usePrevious(messageModalMsgId)

  const scrollableContainerId = useId()
  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef

  const innerRef = useRef<HTMLDivElement>(null)
  const isAtBottom = useIsAtBottom(scrollContainerRef, 100)

  const { data: rawMessageIds } = useCommentIdsByPostId(chatId, {
    subscribe: true,
  })
  const messageIds = rawMessageIds || []

  const [isPausedLoadMore, setIsPausedLoadMore] = useState(false)
  const { currentData: currentPageMessageIds, loadMore } =
    useInfiniteScrollData(messageIds, CHAT_PER_PAGE, isPausedLoadMore)

  const filteredIds = useFilterBlockedMessageIds(chatId, currentPageMessageIds)

  const messageQueries = getPostQuery.useQueries(filteredIds)
  const loadedMessageQueries = useMemo(() => {
    return messageQueries.filter((message) => message.isLoading === false)
  }, [messageQueries])

  useLoadMoreIfNoScroll(loadMore, loadedMessageQueries?.length ?? 0, {
    scrollContainer: scrollContainerRef,
    innerContainer: innerRef,
  })

  const scrollToMessage = useScrollToMessage(
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

  // TODO: refactor this by putting the url query getter logic to ChatPage
  const hasScrolledToMessageRef = useRef(false)
  useEffect(() => {
    if (hasScrolledToMessageRef.current) return
    hasScrolledToMessageRef.current = true

    const messageId = getUrlQuery('messageId')
    const isMessageIdsFetched = rawMessageIds !== undefined

    if (!isMessageIdsFetched) return

    if (!messageId || !validateNumber(messageId)) {
      scrollToMessage(lastReadId ?? '', false)
      return
    }

    setMessageModalMsgId(messageId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawMessageIds, hasScrolledToMessageRef])

  useEffect(() => {
    if (messageModalMsgId) {
      replaceUrl(urlJoin(getChatPageLink(router), `/${messageModalMsgId}`))
    } else if (prevMessageModalMsgId && !messageModalMsgId) {
      replaceUrl(getChatPageLink(router))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevMessageModalMsgId, messageModalMsgId])

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
              'relative flex flex-col-reverse gap-2 !overflow-hidden pb-2',
              // need to have enough room to open message menu
              'min-h-[400px]'
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
                  scrollToMessage={scrollToMessage}
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
      <MessageModal
        isOpen={!!messageModalMsgId}
        closeModal={() => setMessageModalMsgId('')}
        messageId={messageModalMsgId}
        scrollToMessage={scrollToMessage}
      />
      <NewMessageNotice
        className={cx('absolute bottom-0 right-6', newMessageNoticeClassName)}
        messageIds={messageIds}
        scrollContainerRef={scrollContainerRef}
      />
    </Component>
  )
}
