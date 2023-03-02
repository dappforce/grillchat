import Send from '@/assets/icons/send.png'
import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import { useSendMessage } from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/className'
import Image from 'next/image'
import { ComponentProps, useState } from 'react'
import CaptchaModal from './CaptchaModal'

export type ChatFormProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  postId: string
  spaceId: string
}

export default function ChatForm({
  className,
  postId,
  spaceId,
  ...props
}: ChatFormProps) {
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const [isOpenCaptcha, setIsOpenCaptcha] = useState(false)
  const [message, setMessage] = useState('')
  const { mutate: sendMessage } = useSendMessage()

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (isLoggedIn) {
      sendMessage({ message, rootPostId: postId, spaceId })
      setMessage('')
    } else {
      setIsOpenCaptcha(true)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        {...props}
        className={cx('flex w-full', className)}
      >
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
      <CaptchaModal
        isOpen={isOpenCaptcha}
        closeModal={() => {
          setIsOpenCaptcha(false)
          setMessage('')
        }}
        message={message}
        rootPostId={postId}
        spaceId={spaceId}
      />
    </>
  )
}
