import useLastReadMessageIdFromStorage from '@/components/chats/hooks/useLastReadMessageId'
import Container from '@/components/Container'
import MessageModal from '@/components/modals/MessageModal'
import Spinner from '@/components/Spinner'
import usePrevious from '@/hooks/usePrevious'
import useWrapInRef from '@/hooks/useWrapInRef'
import { getPostQuery } from '@/services/api/query'
import { isClientGeneratedOptimisticId } from '@/services/subsocial/commentIds/optimistic'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import { getChatPageLink, getUrlQuery } from '@/utils/links'
import { validateNumber } from '@/utils/strings'
import { replaceUrl, sendMessageToParentWindow } from '@/utils/window'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import urlJoin from 'url-join'
import { ChatListProps } from './ChatList'
import useFocusedLastMessageId from './hooks/useFocusedLastMessageId'
import useIsAtBottom from './hooks/useIsAtBottom'
import { ScrollToMessage } from './hooks/useScrollToMessage'
import { NewMessageNotice } from './NewMessageNotice'

export type ChatListSupportingContentProps = Pick<
  ChatListProps,
  'hubId' | 'chatId' | 'asContainer' | 'newMessageNoticeClassName'
> & {
  scrollToMessage: ScrollToMessage
  renderedMessageLength: number
  messageIds: string[]
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
  renderedMessageLength,
  messageIds,
  isLoadingIds,
}: ChatListSupportingContentProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const isInitialized = useRef(false)
  const [loadingToUnread, setLoadingToUnread] = useState(false)

  const unreadMessage = useMessageData((state) => state.unreadMessage)
  const setUnreadMessage = useMessageData((state) => state.setUnreadMessage)
  const { setLastReadMessageId } = useLastReadMessageIdFromStorage(chatId)

  const lastReadId = useFocusedLastMessageId(chatId)
  const [recipient, setRecipient] = useState('')
  const [messageModalMsgId, setMessageModalMsgId] = useState('')
  const prevMessageModalMsgId = usePrevious(messageModalMsgId)

  const Component = asContainer ? Container<'div'> : 'div'

  const hasScrolledToMessageRef = useRef(false)
  const messageIdsRef = useWrapInRef(messageIds)
  useEffect(() => {
    if (hasScrolledToMessageRef.current) return
    hasScrolledToMessageRef.current = true

    const messageId = getUrlQuery('messageId')
    const recipient = getUrlQuery('targetAcc')
    const isMessageIdsFetched = !isLoadingIds

    if (!isMessageIdsFetched) return

    if (!messageId || !validateNumber(messageId)) {
      if (lastReadId) {
        const afterScroll = () => {
          setLoadingToUnread(false)
          isInitialized.current = true

          const lastReadIdIndex = messageIdsRef.current.findIndex(
            (id) => id === lastReadId
          )
          const newMessageCount = lastReadIdIndex === -1 ? 0 : lastReadIdIndex

          sendMessageToParentWindow('unread', newMessageCount.toString())
          setUnreadMessage({ count: newMessageCount, lastId: lastReadId })
        }

        setLoadingToUnread(true)

        const ids = messageIdsRef.current
        const lastMessageId = ids?.[0]
        if (lastReadId === lastMessageId) afterScroll()
        else
          scrollToMessage(lastReadId ?? '', {
            shouldHighlight: false,
            smooth: false,
          }).then(afterScroll)
      } else {
        isInitialized.current = true
      }
      return
    }

    isInitialized.current = true
    setMessageModalMsgId(messageId)
    setRecipient(recipient)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingIds, messageIdsRef, hasScrolledToMessageRef])

  const lastMessageId = messageIds?.[0] ?? ''
  useEffect(() => {
    if (!isInitialized.current) return

    let lastId = ''
    if (unreadMessage.count === 0) {
      lastId = lastMessageId
      if (!lastId) return
    } else {
      lastId = unreadMessage.lastId ?? ''
    }

    if (isClientGeneratedOptimisticId(lastId)) return
    setLastReadMessageId(
      lastId,
      getPostQuery.getQueryData(queryClient, lastId)?.struct.createdAtTime
    )
  }, [setLastReadMessageId, lastMessageId, unreadMessage, queryClient])

  useEffect(() => {
    if (messageModalMsgId) {
      replaceUrl(urlJoin(getChatPageLink(router), `/${messageModalMsgId}`))
    } else if (prevMessageModalMsgId && !messageModalMsgId) {
      replaceUrl(getChatPageLink(router))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevMessageModalMsgId, messageModalMsgId])

  return (
    <>
      <MessageModal
        hubId={hubId}
        isOpen={!!messageModalMsgId}
        closeModal={() => setMessageModalMsgId('')}
        messageId={messageModalMsgId}
        scrollToMessage={scrollToMessage}
        recipient={recipient}
      />
      <Component className='relative'>
        <div
          className={cx('absolute bottom-2 right-3', newMessageNoticeClassName)}
        >
          {loadingToUnread ? (
            <Spinner />
          ) : (
            <NewMessageNotice
              messageIds={messageIds ?? []}
              scrollContainerRef={scrollContainerRef}
            />
          )}
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
