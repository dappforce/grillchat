import Send from '@/assets/icons/send.svg'
import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import Toast from '@/components/Toast'
import { useSendMessage } from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/className'
import { ComponentProps, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { IoWarningOutline } from 'react-icons/io5'
import CaptchaModal from './CaptchaModal'

export type ChatFormProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  postId: string
  spaceId: string
}

const ESTIMATED_ENERGY_FOR_ONE_TX = 300000000 // TODO: update based on chain

export default function ChatForm({
  className,
  postId,
  spaceId,
  ...props
}: ChatFormProps) {
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const hasEnoughEnergy = useMyAccount(
    (state) => (state.energy ?? 0) > ESTIMATED_ENERGY_FOR_ONE_TX
  )

  const [isOpenCaptcha, setIsOpenCaptcha] = useState(false)
  const [message, setMessage] = useState('')
  const { mutate: sendMessage, error } = useSendMessage()

  useEffect(() => {
    if (error)
      toast.custom((t) => (
        <Toast
          t={t}
          icon={(classNames) => <IoWarningOutline className={classNames} />}
          title='Sending message failed. Please try again'
          description={error?.message}
        />
      ))
  }, [error])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (!message) return
    if (isLoggedIn && hasEnoughEnergy) {
      sendMessage({ message, rootPostId: postId, spaceId })
      setMessage('')
    } else {
      setIsOpenCaptcha(true)
    }
  }

  const isDisabled = !message

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
          autoComplete='off'
          pill
          variant='fill'
          rightElement={(classNames) => (
            <Button
              type='submit'
              size='circle'
              disabled={isDisabled}
              withDisabledStyles={false}
              variant={isDisabled ? 'mutedOutline' : 'primary'}
              className={cx(classNames)}
            >
              <Send className='relative top-px h-4 w-4' />
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
