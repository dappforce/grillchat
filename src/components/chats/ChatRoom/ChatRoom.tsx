import Send from '@/assets/icons/send.png'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Input from '@/components/inputs/Input'
import { useSendMessage } from '@/services/api/mutations'
import { useMyAccount } from '@/stores/my-account'
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
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const [message, setMessage] = useState('')

  // move to inside form only
  const { mutate: sendMessage } = useSendMessage()
  const [isOpenCaptcha, setIsOpenCaptcha] = useState(false)

  const Component = asContainer ? Container<'div'> : 'div'

  const postId = '226'
  const spaceId = '1181'
  const onSubmitForm = (e: any) => {
    e?.preventDefault()
    if (isLoggedIn) {
      sendMessage({ message, rootPostId: postId, spaceId })
    } else {
      setIsOpenCaptcha(true)
    }
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
            value={message}
            onChange={(e) => setMessage((e.target as any).value)}
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
