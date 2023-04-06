import Container from '@/components/Container'
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

  return (
    <div {...props} className={cx('flex flex-col', className)}>
      <ChatList
        postId={postId}
        asContainer={asContainer}
        scrollableContainerClassName={scrollableContainerClassName}
        scrollContainerRef={scrollContainerRef}
        onSelectChatAsReply={setReplyTo}
        replyTo={replyTo}
      />
      <Component className='mt-auto flex flex-col py-3'>
        {replyTo && <RepliedMessage replyChatId={replyTo} />}
        <ChatForm replyTo={replyTo} onSubmit={scrollToBottom} postId={postId} />
      </Component>
    </div>
  )
}
