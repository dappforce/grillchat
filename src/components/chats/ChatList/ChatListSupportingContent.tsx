import Container from '@/components/Container'
import MessageModal from '@/components/modals/MessageModal'
import usePrevious from '@/hooks/usePrevious'
import useWrapInRef from '@/hooks/useWrapInRef'
import { getPostQuery } from '@/services/api/query'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import { getUrlQuery } from '@/utils/links'
import { validateNumber } from '@/utils/strings'
import { replaceUrl } from '@/utils/window'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import urlJoin from 'url-join'
import { ChatListProps } from './ChatList'
import { NewMessageNotice } from './NewMessageNotice'
import useIsAtBottom from './hooks/useIsAtBottom'
import { ScrollToMessage } from './hooks/useScrollToMessage'

export type ChatListSupportingContentProps = Pick<
  ChatListProps,
  'hubId' | 'chatId' | 'asContainer' | 'newMessageNoticeClassName'
> & {
  scrollToMessage: ScrollToMessage
  renderedMessageIds: string[]
  scrollContainerRef: React.RefObject<HTMLDivElement>
  isLoadingIds: boolean
}
export default function ChatListSupportingContent({
  hubId,
  chatId,
  scrollToMessage,
  asContainer,
  newMessageNoticeClassName,
  scrollContainerRef,
  renderedMessageIds,
  isLoadingIds,
}: ChatListSupportingContentProps) {
  const queryClient = useQueryClient()
  const isInitialized = useRef(false)
  // const [loadingToUnread, setLoadingToUnread] = useState(false)

  const unreadMessage = useMessageData((state) => state.unreadMessage)
  const setUnreadMessage = useMessageData((state) => state.setUnreadMessage)
  // const { setLastReadTime } = useLastReadTimeFromStorage(chatId)

  const lastMessageId = renderedMessageIds?.[0] ?? ''
  const lastMessage = getPostQuery.getQueryData(queryClient, lastMessageId)
  const lastMessageTime = lastMessage?.struct.createdAtTime

  // const lastReadTime = useLastFocusedMessageTime(chatId, lastMessageId)

  const [recipient, setRecipient] = useState('')

  const [isOpenMessageModal, setIsOpenMessageModal] = useState(false)
  const [messageModalMsgId, setMessageModalMsgId] = useState('')

  const prevMessageModalMsgId = usePrevious(messageModalMsgId)

  const Component = asContainer ? Container<'div'> : 'div'

  const hasScrolledToMessageRef = useRef(false)
  const renderedMessageIdsRef = useWrapInRef(renderedMessageIds)
  useEffect(() => {
    if (hasScrolledToMessageRef.current) return
    hasScrolledToMessageRef.current = true

    const messageId = getUrlQuery('messageId')
    const recipient = getUrlQuery('targetAcc')
    const isMessageIdsFetched = !isLoadingIds

    if (!isMessageIdsFetched) return

    if (messageId && validateNumber(messageId)) {
      isInitialized.current = true
      setMessageModalMsgId(messageId)
      setIsOpenMessageModal(true)
      setRecipient(recipient)
    }

    // if (lastReadTime) {
    //   const afterScroll = () => {
    //     setLoadingToUnread(false)
    //     isInitialized.current = true

    //     const { index: nearestMessageIndex } =
    //       getNearestMessageIdToTimeFromRenderedIds(
    //         queryClient,
    //         renderedMessageIdsRef.current,
    //         lastReadTime
    //       )
    //     const newMessageCount =
    //       nearestMessageIndex === -1 ? 0 : nearestMessageIndex

    //     sendMessageToParentWindow('unread', newMessageCount.toString())
    //     setUnreadMessage({
    //       count: newMessageCount,
    //       lastMessageTime: lastReadTime,
    //     })
    //   }

    //   setLoadingToUnread(true)

    //   if (!lastMessageTime || lastReadTime >= lastMessageTime) afterScroll()
    //   else {
    //     scrollToMessage(lastReadTime, {
    //       shouldHighlight: false,
    //       smooth: false,
    //     }).then(afterScroll)
    //   }
    // } else {
    //   isInitialized.current = true
    // }
    isInitialized.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingIds, renderedMessageIdsRef, hasScrolledToMessageRef])

  useEffect(() => {
    if (!isInitialized.current) return

    let newLastReadTime: number | null = unreadMessage.lastMessageTime
    if (
      unreadMessage.count === 0 &&
      lastMessageTime &&
      lastMessageTime > unreadMessage.lastMessageTime
    ) {
      newLastReadTime = lastMessageTime
      if (!newLastReadTime) return
    }

    // setLastReadTime(newLastReadTime)
  }, [lastMessageTime, unreadMessage, queryClient])

  useEffect(() => {
    if (messageModalMsgId) {
      replaceUrl(urlJoin('/memes', `/${messageModalMsgId}`))
    } else if (prevMessageModalMsgId && !messageModalMsgId) {
      replaceUrl('/memes')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevMessageModalMsgId, messageModalMsgId])

  const renderedMessageLength = renderedMessageIds.length

  return (
    <>
      <MessageModal
        hubId={hubId}
        isOpen={isOpenMessageModal}
        closeModal={() => setIsOpenMessageModal(false)}
        messageId={messageModalMsgId}
        scrollToMessage={scrollToMessage}
        recipient={recipient}
      />
      <Component className='relative'>
        <div
          className={cx('absolute bottom-2 right-4', newMessageNoticeClassName)}
        >
          {/* {loadingToUnread ? (
            <Spinner />
          ) : ( */}
          <NewMessageNotice
            renderedMessageIds={renderedMessageIds ?? []}
            scrollContainerRef={scrollContainerRef}
          />
          {/* )} */}
        </div>
      </Component>
      <ScrollToBottom
        renderedMessageLength={renderedMessageLength}
        scrollContainerRef={scrollContainerRef}
      />
    </>
  )
}

function ScrollToBottom({
  scrollContainerRef,
  renderedMessageLength,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement>
  renderedMessageLength: number
}) {
  const isAtBottom = useIsAtBottom(scrollContainerRef, 100)
  const replyTo = useMessageData((state) => state.replyTo)

  const isAtBottomRef = useWrapInRef(isAtBottom)
  useEffect(() => {
    if (!isAtBottomRef.current) return
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current?.scrollHeight,
      behavior: 'auto',
    })
  }, [renderedMessageLength, isAtBottomRef, scrollContainerRef, replyTo])

  return null
}
