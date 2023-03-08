import Container from '@/components/Container'
import { cx } from '@/utils/className'
import { ComponentProps } from 'react'
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

  return (
    <div {...props} className={cx('flex flex-col', className)}>
      <ChatList
        postId={postId}
        asContainer={asContainer}
        scrollableContainerClassName={scrollableContainerClassName}
      />
      <Component className='mt-auto flex py-3'>
        <ChatForm postId={postId} spaceId={spaceId} />
      </Component>
    </div>
  )
}
