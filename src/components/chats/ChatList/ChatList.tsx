import PinIcon from '@/assets/icons/pin.png'
import useInfiniteScrollData from '@/components/chats/ChatList/hooks/useInfiniteScrollData'
import Container from '@/components/Container'
import LinkText from '@/components/LinkText'
import MessageModal from '@/components/modals/MessageModal'
import ScrollableContainer from '@/components/ScrollableContainer'
import { CHAT_PER_PAGE, getPinnedMessageInChatId } from '@/constants/chat'
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
import Image from 'next/image'
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
import ChatItemMenus from '../ChatItem/ChatItemMenus'
import { getMessageElementId } from '../utils'
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
  scrollContainerRef?: React.RefObject<HTMLDivElement>
  scrollableContainerClassName?: string
  hubId: string
  chatId: string
  replyTo?: string
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
  hubId,
  chatId,
  scrollContainerRef: _scrollContainerRef,
  replyTo,
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

  const filteredMessageIds = useFilterBlockedMessageIds(
    hubId,
    chatId,
    messageIds
  )
  const filteredCurrentPageIds = useFilterBlockedMessageIds(
    hubId,
    chatId,
    currentPageMessageIds
  )

  const messageQueries = getPostQuery.useQueries(filteredCurrentPageIds)
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
      if (lastReadId) scrollToMessage(lastReadId ?? '', false)
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

  const myAddress = useMyAccount((state) => state.address)
  const { data: chat } = getPostQuery.useQuery(chatId)
  const isMyChat = chat?.struct.ownerId === myAddress

  const Component = asContainer ? Container<'div'> : 'div'

  const isAllMessagesLoaded =
    loadedMessageQueries.length === filteredMessageIds.length

  const scrollThreshold =
    (scrollContainerRef.current?.scrollHeight ?? 0) *
      SCROLL_THRESHOLD_PERCENTAGE || DEFAULT_SCROLL_THRESHOLD

  return (
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
      {messageIds.length === 0 && (
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
        <Component ref={innerRef}>
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
            endMessage={
              messageQueries.length === 0 ? null : (
                <ChatTopNotice className='pb-2 pt-4' />
              )
            }
            scrollThreshold={`${scrollThreshold}px`}
          >
            {messageQueries.map(({ data: message }, index) => {
              const isLastReadMessage = lastReadId === message?.id
              // bottom message is the first element, because the flex direction is reversed
              const isBottomMessage = index === 0
              const showLastUnreadMessageNotice =
                isLastReadMessage && !isBottomMessage

              const chatElement = message && (
                <ChatItemMenus messageId={message.id} key={message.id}>
                  {(config) => {
                    const { referenceProps, toggleDisplay } = config || {}
                    return (
                      <div
                        {...referenceProps}
                        onContextMenu={(e) => {
                          e.preventDefault()
                          toggleDisplay?.(e)
                        }}
                      >
                        <ChatItemContainer
                          enableChatMenu={false}
                          hubId={hubId}
                          chatId={chatId}
                          message={message}
                          messageBubbleId={getMessageElementId(message.id)}
                          scrollToMessage={scrollToMessage}
                        />
                      </div>
                    )
                  }}
                </ChatItemMenus>
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
        </Component>
      </ScrollableContainer>
      <MessageModal
        isOpen={!!messageModalMsgId}
        closeModal={() => setMessageModalMsgId('')}
        messageId={messageModalMsgId}
        scrollToMessage={scrollToMessage}
      />
      <Component>
        <div className='relative'>
          <NewMessageNotice
            className={cx(
              'absolute bottom-2 right-3',
              newMessageNoticeClassName
            )}
            messageIds={messageIds}
            scrollContainerRef={scrollContainerRef}
          />
        </div>
      </Component>
    </div>
  )
}

function CenterChatNotice({
  isMyChat,
  ...props
}: ComponentProps<'div'> & { isMyChat: boolean }) {
  return (
    <div
      {...props}
      className={cx(
        'flex flex-col rounded-2xl bg-background-light/50 px-6 py-4 text-sm text-text-muted',
        props.className
      )}
    >
      {isMyChat ? (
        <>
          <div>
            <span>You have created a public group chat, which is:</span>
            <div className='pl-4'>
              <ul className='mb-1 list-disc whitespace-nowrap pl-2'>
                <li>Persistent & on-chain</li>
                <li>Censorship resistant</li>
                <li>
                  Powered by{' '}
                  <LinkText
                    href='https://subsocial.network'
                    openInNewTab
                    variant='primary'
                  >
                    Subsocial
                  </LinkText>
                </li>
              </ul>
            </div>

            <span>You can:</span>
            <div className='pl-4'>
              <ul className='list-disc whitespace-nowrap pl-2'>
                <li>Moderate content and users</li>
                <li>Hide the chat from others on Grill</li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <span>No messages here yet</span>
      )}
    </div>
  )
}

type PinnedMessageProps = {
  chatId: string
  asContainer?: boolean
  scrollToMessage: ReturnType<typeof useScrollToMessage>
}
function PinnedMessage({
  chatId,
  asContainer,
  scrollToMessage,
}: PinnedMessageProps) {
  const pinnedMessage = getPinnedMessageInChatId(chatId)
  const { data: message } = getPostQuery.useQuery(pinnedMessage)
  if (!message) return null

  const Component = asContainer ? Container<'div'> : 'div'
  return (
    <div className='sticky top-0 z-10 border-b border-border-gray bg-background-light text-sm'>
      <Component
        className='flex cursor-pointer items-center gap-4 overflow-hidden py-2'
        onClick={() => scrollToMessage(message.id, true)}
      >
        <div className='mr-1'>
          <Image
            src={PinIcon}
            alt='pin'
            width={16}
            height={16}
            className='mx-3 h-4 w-4 flex-shrink-0'
          />
        </div>
        <div className='flex flex-col overflow-hidden'>
          <span className='font-medium text-text-primary'>Pinned Message</span>
          <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
            {message.content?.body}
          </span>
        </div>
      </Component>
    </div>
  )
}
