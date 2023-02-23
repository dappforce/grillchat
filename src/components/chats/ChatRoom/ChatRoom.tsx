import Send from '@/assets/icons/send.png'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Input from '@/components/inputs/Input'
import { cx } from '@/utils/className'
import Image from 'next/image'
import { ComponentProps, useState } from 'react'
import ChatList from '../ChatList'
import CaptchaModal from './CaptchaModal'

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
  const [isOpenCaptcha, setIsOpenCaptcha] = useState(false)

  const Component = asContainer ? Container<'div'> : 'div'

  const onSubmitForm = (e: any) => {
    e?.preventDefault()
    setIsOpenCaptcha(true)
  }

  return (
    <div {...props} className={cx('flex flex-col', className)}>
      <ChatList
        asContainer={asContainer}
        scrollableContainerClassName={scrollableContainerClassName}
      />
      <Component className='mt-auto flex py-3'>
        <form onSubmit={onSubmitForm} className='flex w-full'>
          <Input
            placeholder='Message...'
            pill
            variant='fill'
            rightElement={(classNames) => (
              <Button type='submit' size='circle' className={cx(classNames)}>
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
      <CaptchaModal
        isOpen={isOpenCaptcha}
        closeModal={() => setIsOpenCaptcha(false)}
      />
    </div>
  )
}
