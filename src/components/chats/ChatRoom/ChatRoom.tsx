import Send from '@/assets/icons/send.png'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Input from '@/components/inputs/Input'
import ScrollableContainer from '@/components/ScrollableContainer'
import { useCommentIdsByPostId } from '@/services/queries'
import { cx } from '@/utils/className'
import Image from 'next/image'
import { ComponentProps, useId, useLayoutEffect, useState } from 'react'
import ChatItem from '../ChatItem'
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
  const id = useId()

  const postId = '226'
  const { data } = useCommentIdsByPostId(postId, { subscribe: true })

  const [isOpenCaptcha, setIsOpenCaptcha] = useState(false)

  const Component = asContainer ? Container<'div'> : 'div'

  useLayoutEffect(() => {
    const chatRoom = document.getElementById(id)
    chatRoom?.scrollTo({ top: chatRoom.scrollHeight })
  }, [id])

  const onSubmitForm = (e: any) => {
    e?.preventDefault()
    setIsOpenCaptcha(true)
  }

  return (
    <div {...props} className={cx('flex flex-col', className)}>
      <ScrollableContainer
        as={Component}
        id={id}
        className={scrollableContainerClassName}
      >
        <div className={cx('flex flex-col gap-2')}>
          {(data ?? []).map((commentId, index) => (
            <div className={cx('w-10/12')} key={index}>
              <ChatItem commentId={commentId} />
            </div>
          ))}
        </div>
      </ScrollableContainer>
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
