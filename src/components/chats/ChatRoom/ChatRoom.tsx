import Button from '@/components/Button'
import Container from '@/components/Container'
import useIsJoinedToChat from '@/hooks/useIsJoinedToChat'
import useToastError from '@/hooks/useToastError'
import { useJoinChat } from '@/services/subsocial/posts/mutation'
import { cx } from '@/utils/class-names'
import { ComponentProps, useRef, useState } from 'react'
import ChatList from '../ChatList/ChatList'
import ChatForm from './ChatForm'
import RepliedMessage from './RepliedMessage'

export type ChatRoomProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  chatId: string
}

export default function ChatRoom({
  className,
  asContainer,
  scrollableContainerClassName,
  chatId,
  ...props
}: ChatRoomProps) {
  const { mutate: joinChat, isLoading, error } = useJoinChat()
  useToastError(error, 'Failed to join chat')

  const [replyTo, setReplyTo] = useState<string | undefined>(undefined)

  const Component = asContainer ? Container<'div'> : 'div'
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer?.scrollTo({
        top: scrollContainer?.scrollHeight,
        behavior: 'auto',
      })
    }
  }

  const closeReply = () => setReplyTo(undefined)

  const hasJoined = useIsJoinedToChat(chatId)

  return (
    <div {...props} className={cx('flex flex-col', className)}>
      <ChatList
        newMessageNoticeClassName={cx(replyTo && 'bottom-2')}
        chatId={chatId}
        asContainer={asContainer}
        scrollableContainerClassName={scrollableContainerClassName}
        scrollContainerRef={scrollContainerRef}
        onSelectMessageAsReply={setReplyTo}
        replyTo={replyTo}
      />
      <Component
        className={cx('mt-auto flex flex-col py-3', replyTo && 'pt-0')}
      >
        {replyTo && (
          <RepliedMessage
            closeReply={closeReply}
            replyMessageId={replyTo}
            scrollContainer={scrollContainerRef}
          />
        )}
        {hasJoined ? (
          <ChatForm
            replyTo={replyTo}
            onSubmit={scrollToBottom}
            chatId={chatId}
            clearReplyTo={closeReply}
          />
        ) : (
          <Button
            size='lg'
            isLoading={isLoading}
            onClick={() => joinChat({ chatId })}
          >
            Join
          </Button>
        )}
      </Component>
    </div>
  )
}
