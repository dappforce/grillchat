import Button from '@/components/Button'
import TextArea from '@/components/inputs/TextArea'
import Logo from '@/components/Logo'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import ProfilePreview from '@/components/ProfilePreview'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useToastError from '@/hooks/useToastError'
import { ApiRequestTokenResponse } from '@/pages/api/request-token'
import { useMyAccount } from '@/stores/my-account'
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useRef,
  useState,
} from 'react'
import { useAccount } from 'wagmi'
import { CustomConnectButton } from './CustomConnectButton'
import { useLinkEvmAccount } from './linkEvmAccountHook'
import { useSignEvmLinkMessage } from './utils'

export type LoginModalStep = 'login' | 'enter-secret-key' | 'account-created'

type ContentProps = ModalFunctionalityProps & {
  setCurrentStep: Dispatch<SetStateAction<LoginModalStep>>
  currentStep: LoginModalStep
  onSubmit: (e: SyntheticEvent) => Promise<void>
  openModal: () => void
  runCaptcha: () => Promise<string | null>
  termsAndService: (className?: string) => JSX.Element
}

export const LoginContent = ({
  onSubmit,
  setCurrentStep,
  currentStep,
  runCaptcha,
  termsAndService,
  ...props
}: ContentProps) => {
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
    <div>
      <div className='flex w-full flex-col justify-center'>
        <Logo className='mb-8 text-5xl' />
        <div className='flex flex-col gap-4'>
          <Button onClick={() => setCurrentStep('enter-secret-key')} size='lg'>
            Enter Grill secret key
          </Button>
          <Button
            type='button'
            variant='primaryOutline'
            size='lg'
            className='w-full'
            isLoading={isLoading}
            onClick={async () => {
              setHasStartCaptcha(true)
              const token = await runCaptcha()
              if (!token) return
              setHasStartCaptcha(false)
              const newAddress = await loginAndRequestToken({
                captchaToken: token,
              })
              if (newAddress) {
                setCurrentStep('account-created')
              }
              // props.closeModal()
            }}
          >
            Create an account
          </Button>

          {termsAndService('mt-4')}
        </div>
      </div>
    </div>
  )
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
        autoFocus
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

export const AccountCreatedContent = () => {
  const { signEvmLinkMessage, isSigningMessage } = useSignEvmLinkMessage()

  const { address: evmAddress } = useAccount({
    onConnect: async ({ address: connectedEvmAddress }) => {
      const data = await signEvmLinkMessage(connectedEvmAddress, address)

      if (data) {
        linkAccount({
          evmAccount: evmAddress as string,
          evmSignature: data,
        })
      }
    },
  })

  const { mutate: linkAccount } = useLinkEvmAccount()
  const address = useMyAccount((state) => state.address)

  return (
    <div className='flex flex-col'>
      {address && (
        <div className='mt-2 mb-6 rounded-2xl bg-slate-700 p-4'>
          <ProfilePreview address={address} />
        </div>
      )}
      <div className='flex items-center'>
        <div className='w-full border-b border-background-lightest'></div>
        <p className='min-w-fit px-4 text-text-muted'>WHAT’S NEXT?</p>
        <div className='w-full border-b border-background-lightest'></div>
      </div>
      <p className='mb-4 mt-6 text-text-muted'>
        Now you can connect EVM wallet to benefit from EVM features such as
        ERC20 tokens, NFTs and more.
      </p>
      <CustomConnectButton
        className='w-full'
        signEvmLinkMessage={signEvmLinkMessage}
        isSigningMessage={isSigningMessage}
      />
    </div>
  )
}

type LoginModalContents = {
  [key in LoginModalStep]: (props: ContentProps) => JSX.Element
}

export const loginModalContents: LoginModalContents = {
  login: LoginContent,
  'enter-secret-key': EnterSecretKeyContent,
  'account-created': AccountCreatedContent,
}
