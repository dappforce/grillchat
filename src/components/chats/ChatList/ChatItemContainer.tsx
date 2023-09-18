import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import usePrevious from '@/hooks/usePrevious'
import { useMessageData } from '@/stores/message'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { ComponentProps, forwardRef, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import ChatItem, { ChatItemProps } from '../ChatItem'

export type ChatItemContainerProps = Omit<ChatItemProps, 'isMyMessage'> & {
  containerProps?: ComponentProps<'div'>
  chatId: string
  hubId: string
}

function ChatItemContainer(
  { containerProps, chatId, hubId, ...props }: ChatItemContainerProps,
  ref: any
) {
  const { message } = props
  const isMessageBlockedInCurrentHub = useIsMessageBlocked(
    hubId,
    message,
    chatId
  )
  const isMessageBlockedInOriginalHub = useIsMessageBlocked(
    message.struct.spaceId ?? '',
    message,
    chatId
  )
  const isMessageBlocked =
    isMessageBlockedInCurrentHub || isMessageBlockedInOriginalHub

  const { content } = message
  const { body, extensions } = content || {}
  const address = useMyAccount((state) => state.address)

  if (isMessageBlocked || (!body && !extensions)) return null

  const ownerId = message.struct.ownerId
  const senderAddress = ownerId ?? ''

  const isMyMessage = address === senderAddress

  return (
    <div
      {...containerProps}
      ref={ref}
      // to prevent chat item from disappearing in IOS
      // ref: https://stackoverflow.com/a/54582980
      style={{ transform: 'translate3d(0, 0, 0)' }}
      className={cx(
        'w-11/12 md:w-8/12',
        isMyMessage && 'self-end',
        containerProps?.className
      )}
    >
      <UnreadMessageChecker messageId={message.id} />
      <ChatItem
        {...props}
        chatId={chatId}
        isMyMessage={isMyMessage}
        hubId={hubId}
      />
    </div>
  )
}

function UnreadMessageChecker({ messageId }: { messageId: string }) {
  const { ref, inView } = useInView({
    onChange: (inView) => {
      if (inView) handleInView()
    },
  })

  const unreadMessage = useMessageData((state) => state.unreadMessage)
  const setUnreadMessage = useMessageData((state) => state.setUnreadMessage)
  const prevCount = usePrevious(unreadMessage.count)

  const handleInView = (isAfterScroll?: boolean) => {
    if (!unreadMessage.lastId || !unreadMessage.count) return
    const prevLastId = Number(unreadMessage.lastId)
    const currentMessageId = Number(messageId)
    if (isAfterScroll || prevLastId < currentMessageId) {
      setUnreadMessage((prev) => ({
        count: prev.count - 1,
        lastId: Math.max(prevLastId, currentMessageId).toString(),
      }))
    }
  }

  const isPrevCountZero = prevCount === 0
  useEffect(() => {
    if (
      inView &&
      isPrevCountZero &&
      Number(unreadMessage.lastId) < Number(messageId)
    ) {
      handleInView(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, isPrevCountZero, unreadMessage.count, messageId])

  return (
    <div
      ref={ref}
      onChange={(inView) => {
        if (inView) handleInView()
      }}
    />
  )
}

export default forwardRef(ChatItemContainer)
