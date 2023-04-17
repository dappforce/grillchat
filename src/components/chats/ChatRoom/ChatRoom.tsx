import Container from '@/components/Container'
import { SelectedMessage } from '@/services/subsocial/commentIds'
import { cx } from '@/utils/class-names'
import { ComponentProps, useRef, useState } from 'react'
import ChatList from '../ChatList/ChatList'
import ChatForm from './ChatForm'
import RepliedMessage from './RepliedMessage'

export type ChatRoomProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  postId: string
}

export default function ChatRoom({
  className,
  asContainer,
  scrollableContainerClassName,
  postId,
  ...props
}: ChatRoomProps) {
  const [selectedMessage, setSelectedMessage] = useState<
    SelectedMessage | undefined
  >()

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

  const closeReply = () => setSelectedMessage(null)

  return (
    <div {...props} className={cx('flex flex-col', className)}>
      <ChatList
        newChatNoticeClassName={cx(selectedMessage && 'bottom-2')}
        postId={postId}
        asContainer={asContainer}
        scrollableContainerClassName={scrollableContainerClassName}
        scrollContainerRef={scrollContainerRef}
        onSelectMessage={setSelectedMessage}
        selectedMessageId={selectedMessage?.id}
      />
      <Component
        className={cx('mt-auto flex flex-col py-3', selectedMessage && 'pt-0')}
      >
        {selectedMessage && (
          <RepliedMessage
            closeReply={closeReply}
            selectedMessage={selectedMessage}
            scrollContainer={scrollContainerRef}
          />
        )}
        <ChatForm
          selectedMessage={selectedMessage}
          onSubmit={scrollToBottom}
          postId={postId}
          clearReplyTo={closeReply}
        />
      </Component>
    </div>
  )
}
