import { cx } from '@/utils/className'
import { ComponentProps } from 'react'
import ChatItem from './ChatItem'

export type ChatRoomProps = ComponentProps<'div'> & {
  chats: { text: string; alignment: 'left' | 'right' }[]
}

export default function ChatRoom({
  className,
  chats,
  ...props
}: ChatRoomProps) {
  return (
    <div {...props} className={cx('flex flex-col gap-2', className)}>
      {chats.map((chat, index) => (
        <ChatItem key={index} text={chat.text} alignment={chat.alignment} />
      ))}
    </div>
  )
}
