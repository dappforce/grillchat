import Send from '@/assets/icons/send.png'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Input from '@/components/inputs/Input'
import ScrollableContainer from '@/components/ScrollableContainer'
import { cx } from '@/utils/className'
import Image from 'next/image'
import { ComponentProps } from 'react'
import ChatItem from './ChatItem'

export type ChatRoomProps = ComponentProps<'div'> & {
  chats: { text: string; alignment: 'left' | 'right' }[]
  asContainer?: boolean
  scrollableContainerClassName?: string
}

export default function ChatRoom({
  className,
  chats,
  asContainer,
  scrollableContainerClassName,
  ...props
}: ChatRoomProps) {
  const Component = asContainer ? Container<'div'> : 'div'

  return (
    <div {...props} className={cx('flex flex-col', className)}>
      <ScrollableContainer
        as={Component}
        className={scrollableContainerClassName}
      >
        <div className={cx('flex flex-col gap-2')}>
          {chats.map((chat, index) => (
            <ChatItem key={index} text={chat.text} alignment={chat.alignment} />
          ))}
        </div>
      </ScrollableContainer>
      <Component className='mt-auto flex py-3'>
        <Input
          placeholder='Message...'
          rightElement={(classNames) => (
            <Button circleButton className={cx(classNames)}>
              <Image
                className='relative top-px h-4 w-4'
                src={Send}
                alt='send'
              />
            </Button>
          )}
        />
      </Component>
    </div>
  )
}
