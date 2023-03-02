import Container from '@/components/Container'
import { getSpaceId } from '@/constants/space'
import { cx } from '@/utils/className'
import { ComponentProps } from 'react'
import ChatList from '../ChatList/ChatList'
import ChatForm from './ChatForm'

export type ChatRoomProps = ComponentProps<'div'> & {
  chats: { text: string; alignment: 'left' | 'right' }[]
  asContainer?: boolean
  scrollableContainerClassName?: string
  postId: string
}

export default function ChatRoom({
  className,
  chats,
  asContainer,
  scrollableContainerClassName,
  postId,
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
        <ChatForm postId={postId} spaceId={getSpaceId()} />
      </Component>
    </div>
  )
}
