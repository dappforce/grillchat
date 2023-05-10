import Button from '@/components/Button'
import CaptchaInvisible from '@/components/captcha/CaptchaInvisible'
import TextArea from '@/components/inputs/TextArea'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useToastError from '@/hooks/useToastError'
import { ApiRequestTokenResponse } from '@/pages/api/request-token'
import { Dispatch, SetStateAction, SyntheticEvent, useRef, useState } from 'react'

export type LoginModalStep = 'login' | 'wallet-selector' | 'enter-secret-key'

type ContentProps = ModalFunctionalityProps & {
  setCurrentStep: Dispatch<SetStateAction<LoginModalStep>>
  onSubmit: (e: SyntheticEvent) => Promise<void>
  openModal: () => void
}

export const LoginContent = ({ onSubmit, setCurrentStep, ...props }: ContentProps) => {
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

  return (
    <div className='flex flex-col gap-4'>
      <Button onClick={() => setCurrentStep('wallet-selector')} size='lg'>Connect wallet</Button>
      <div className='w-full'>
        <CaptchaInvisible>
          {(runCaptcha, termsAndService) => {
            return (
              <div className='flex flex-col gap-4'>
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
                <Button onClick={() => setCurrentStep('enter-secret-key')} variant='primaryOutline' size='lg'>
                  Enter Grill secret key
                </Button>
                {termsAndService('mt-5')}
              </div>
            )
          }}
        </CaptchaInvisible>
      </div>
    </div>
  )
}

export const WallerSellectorContent = ({}: ContentProps) => {
  return <></>
}

export const EnterSecretKeyContent = ({ onSubmit }: ContentProps) => {
  const [privateKey, setPrivateKey] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  return (
    <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-4'>
      <TextArea
        ref={inputRef}
        value={privateKey}
        rows={3}
        size='sm'
        className='bg-background'
        onChange={(e) => setPrivateKey((e.target as HTMLTextAreaElement).value)}
        placeholder='Enter your Grill secret key'
      />
      <Button disabled={!privateKey} size='lg'>
        Login
      </Button>
    </form>
  )
}

type LoginModalContents = {
  [key in LoginModalStep]: (props: ContentProps) => JSX.Element
}

export const loginModalContents: LoginModalContents = {
  login: LoginContent,
  'wallet-selector': WallerSellectorContent,
  'enter-secret-key': EnterSecretKeyContent,
}
