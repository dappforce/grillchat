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
            <div
              className={cx(
                'w-10/12',
                chat.alignment === 'right' && 'self-end justify-self-end'
              )}
              key={index}
            >
              <ChatItem text={chat.text} alignment={chat.alignment} />
            </div>
          ))}
        </div>
      </ScrollableContainer>
      <Component className='mt-auto flex py-3'>
        <form className='flex w-full'>
          <Input
            placeholder='Message...'
            rightElement={(classNames) => (
              <Button type='submit' circleButton className={cx(classNames)}>
                <Image
                  className='relative top-px h-4 w-4'
                  src={Send}
                  alt='send'
                />
              </Button>
            )}
          />
        </form>
      </Component>
    </div>
  )
}
