import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useToastError from '@/hooks/useToastError'
import { ApiRequestTokenResponse } from '@/pages/api/request-token'
import { useMyAccount } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { SyntheticEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '../Button'
import CaptchaInvisible from '../captcha/CaptchaInvisible'
import TextArea from '../inputs/TextArea'
import Toast from '../Toast'
import Modal, { ModalFunctionalityProps } from './Modal'

export type LoginModalProps = ModalFunctionalityProps & {
  afterLogin?: () => void
  beforeLogin?: () => void
  openModal: () => void
}

export default function LoginModal({
  afterLogin,
  beforeLogin,
  ...props
}: LoginModalProps) {
  const login = useMyAccount((state) => state.login)
  const [privateKey, setPrivateKey] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [hasStartCaptcha, setHasStartCaptcha] = useState(false)
  const {
    mutateAsync: loginAndRequestToken,
    isLoading: loadingRequestToken,
    error,
  } = useLoginAndRequestToken()
  useToastError<ApiRequestTokenResponse>(
    error,
    'Create account failed',
    (e) => e.message
  )

  const isLoading = loadingRequestToken || hasStartCaptcha

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    beforeLogin?.()
    if (await login(privateKey)) {
      afterLogin?.()
      setPrivateKey('')
      props.closeModal()
    } else {
      toast.custom((t) => (
        <Toast
          t={t}
          title='Login Failed'
          description='The grill secret key you provided is not valid'
        />
      ))
    }
  }

  const desc =
    'To access GrillChat, you need a Grill secret key. If you do not have one, just write your first chat message, and you will be given one.'

  return (
    <Modal
      {...props}
      withFooter
      initialFocus={isTouchDevice() ? undefined : inputRef}
      title='🔐 Login'
      withCloseButton
      description={desc}
    >
      <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-4'>
        <TextArea
          ref={inputRef}
          value={privateKey}
          rows={3}
          size='sm'
          className='bg-background'
          onChange={(e) =>
            setPrivateKey((e.target as HTMLTextAreaElement).value)
          }
          placeholder='Enter your Grill secret key'
        />
        <Button disabled={!privateKey} size='lg'>
          Login
        </Button>
        <div className='w-full'>
          <CaptchaInvisible>
            {(runCaptcha, termsAndService) => {
              return (
                <>
                  <Button
                    variant='primaryOutline'
                    type='button'
                    size='lg'
                    className='w-full'
                    isLoading={isLoading}
                    onClick={async () => {
                      setHasStartCaptcha(true)
                      const token = await runCaptcha()
                      if (!token) return
                      setHasStartCaptcha(false)
                      await loginAndRequestToken({ captchaToken: token })
                      props.closeModal()
                    }}
                  >
                    Create an account
                  </Button>
                  {termsAndService('mt-5')}
                </>
              )
            }}
          </CaptchaInvisible>
        </div>
      </form>
    </Modal>
  )
}
