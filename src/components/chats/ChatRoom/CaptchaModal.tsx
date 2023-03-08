import Button from '@/components/Button'
import Captcha from '@/components/Captcha'
import Modal, { ModalFunctionalityProps } from '@/components/Modal'
import Toast from '@/components/Toast'
import { useRequestTokenAndSendMessage } from '@/hooks/useRequestTokenAndSendMessage'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { IoWarningOutline } from 'react-icons/io5'

export type CaptchaModalProps = ModalFunctionalityProps & SendMessageParams

export default function CaptchaModal({
  message,
  rootPostId,
  spaceId,
  ...props
}: CaptchaModalProps) {
  const { mutateAsync: requestTokenAndSendMessage, error } =
    useRequestTokenAndSendMessage()
  const [token, setToken] = useState('')

  useEffect(() => {
    if (error)
      toast.custom((t) => (
        <Toast
          t={t}
          icon={(classNames) => <IoWarningOutline className={classNames} />}
          title='Sign up or send message failed. Please try again'
          description={(error as Error)?.message}
        />
      ))
  }, [error])

  const submitCaptcha = async () => {
    requestTokenAndSendMessage({
      captchaToken: token,
      message,
      rootPostId,
      spaceId,
    })
    setToken('')
    props.closeModal()
  }

  return (
    <Modal
      {...props}
      size='sm'
      titleClassName='text-center'
      title='🤖 Are you a human?'
    >
      <div className='flex flex-col items-stretch gap-6 pt-4'>
        <div className='flex flex-col items-center'>
          <Captcha token={token} setToken={setToken} />
        </div>
        <Button disabled={!token} size='lg' onClick={submitCaptcha}>
          Continue
        </Button>
      </div>
    </Modal>
  )
}
