import Container from '@/components/Container'
import { cx } from '@/utils/class-names'
import { ComponentProps, useRef } from 'react'
import ChatList from '../ChatList/ChatList'
import ChatForm from './ChatForm'

export type ChatRoomProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  postId: string
  spaceId: string
}

export default function ChatRoom({
  className,
  asContainer,
  scrollableContainerClassName,
  postId,
  spaceId,
  ...props
}: ChatRoomProps) {
  const Component = asContainer ? Container<'div'> : 'div'
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }

  return (
    <div {...props} className={cx('flex flex-col', className)}>
      <ChatList
        postId={postId}
        asContainer={asContainer}
        scrollableContainerClassName={scrollableContainerClassName}
        scrollContainerRef={scrollContainerRef}
      />
      <Component className='mt-auto flex py-3'>
        <ChatForm onSubmit={scrollToBottom} postId={postId} spaceId={spaceId} />
      </Component>
    </div>
  )
}
