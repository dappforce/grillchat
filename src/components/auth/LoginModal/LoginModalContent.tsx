import CreateAccountIcon from '@/assets/icons/create-account.svg'
import KeyIcon from '@/assets/icons/key.svg'
import WalletIcon from '@/assets/icons/wallet.svg'
import {
  CommonEvmAddressLinked,
  CommonEVMLoginErrorContent,
} from '@/components/auth/CommonModalContent'
import Button from '@/components/Button'
import TextArea from '@/components/inputs/TextArea'
import Logo from '@/components/Logo'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import ProfilePreview from '@/components/ProfilePreview'
import SubsocialProfileForm from '@/components/subsocial-profile/SubsocialProfileForm'
import Toast from '@/components/Toast'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useSignMessageAndLinkEvmAddress from '@/hooks/useSignMessageAndLinkEvmAddress'
import useToastError from '@/hooks/useToastError'
import { ApiRequestTokenResponse } from '@/pages/api/request-token'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useRef,
  useState,
} from 'react'
import { toast } from 'react-hot-toast'
import { CustomConnectButton } from '../CustomConnectButton'

export type LoginModalStep =
  | 'login'
  | 'enter-secret-key'
  | 'subsocial-profile'
  | 'account-created'
  | 'account-created-after-name-set'
  | 'evm-address-linked'
  | 'evm-linking-error'

type ContentProps = ModalFunctionalityProps & {
  setCurrentStep: Dispatch<SetStateAction<LoginModalStep>>
  currentStep: LoginModalStep
  runCaptcha: () => Promise<string | null>
  termsAndService: (className?: string) => JSX.Element
  afterLogin?: () => void
  beforeLogin?: () => void
}

export const LoginContent = ({
  setCurrentStep,
  runCaptcha,
  termsAndService,
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
        <Logo className='mb-8 mt-4 text-5xl' />
        <div className='flex flex-col gap-4'>
          <Button onClick={() => setCurrentStep('enter-secret-key')} size='lg'>
            <div className='flex items-center justify-center gap-2'>
              <KeyIcon />
              Enter Grill secret key
            </div>
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
            <div className='flex items-center justify-center gap-2'>
              <CreateAccountIcon />
              Create an account
            </div>
          </Button>

          {termsAndService('mt-4')}
        </div>
      </div>
    </div>
  )
}

export const EnterSecretKeyContent = ({
  beforeLogin,
  afterLogin,
  closeModal,
}: ContentProps) => {
  const login = useMyAccount((state) => state.login)
  const [privateKey, setPrivateKey] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sendEvent = useSendEvent()

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    beforeLogin?.()

    if (await login(privateKey)) {
      afterLogin?.()
      sendEvent('login', { eventSource: 'login_modal' })
      setPrivateKey('')
      closeModal()
    } else {
      toast.custom((t) => (
        <Toast
          t={t}
          title='Login Failed'
          description='The Grill secret key you provided is not valid'
        />
      ))
    }
  }

  return (
    <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-4'>
      <TextArea
        ref={inputRef}
        value={privateKey}
        rows={3}
        size='sm'
        autoFocus
        variant='fill-bg'
        onChange={(e) => setPrivateKey((e.target as HTMLTextAreaElement).value)}
        placeholder='Enter your Grill secret key'
      />
      <Button disabled={!privateKey} type='submit' size='lg'>
        Login
      </Button>
    </form>
  )
}

export const AccountCreatedContent = ({ setCurrentStep }: ContentProps) => {
  const sendEvent = useSendEvent()
  const address = useMyAccount((state) => state.address)

  const { signAndLinkEvmAddress, isLoading } = useSignMessageAndLinkEvmAddress({
    setModalStep: () => setCurrentStep('evm-address-linked'),
    onError: () => setCurrentStep('evm-linking-error'),
  })

  return (
    <div className='flex flex-col'>
      {address && (
        <div
          className={cx(
            'mb-6 mt-2 flex flex-col rounded-2xl bg-background-lighter p-4'
          )}
        >
          <ProfilePreview address={address} avatarClassName={cx('h-16 w-16')} />
          <Button
            variant='primaryOutline'
            className='mt-4'
            onClick={() => setCurrentStep('subsocial-profile')}
          >
            Change my name
          </Button>
        </div>
      )}
      <div className='flex items-center'>
        <div className='w-full border-b border-background-lightest'></div>
        <p className='min-w-fit px-4 text-text-muted'>WHAT’S NEXT?</p>
        <div className='w-full border-b border-background-lightest'></div>
      </div>
      <p className='mb-4 mt-6 text-text-muted'>
        Now, you can connect an EVM wallet to benefit from EVM features such as
        ERC-20 tokens, NFTs, and other smart contracts.
      </p>
      <CustomConnectButton
        withWalletActionImage={false}
        className='w-full'
        signAndLinkEvmAddress={signAndLinkEvmAddress}
        isLoading={isLoading}
        secondLabel='Sign Message'
        onClick={() =>
          sendEvent('start_link_evm_address', {
            eventSource: 'account_created',
          })
        }
        label={
          <div className='flex items-center justify-center gap-2'>
            <WalletIcon />
            Connect Wallet
          </div>
        }
      />
    </div>
  )
}

export const EvmLoginError = ({ setCurrentStep }: ContentProps) => (
  <CommonEVMLoginErrorContent
    setModalStep={() => setCurrentStep('evm-address-linked')}
    signAndLinkOnConnect={true}
  />
)

export const SubsocialProfileContent = ({ setCurrentStep }: ContentProps) => (
  <SubsocialProfileForm
    onSuccess={() => setCurrentStep('account-created-after-name-set')}
  />
)

type LoginModalContents = {
  [key in LoginModalStep]: (props: ContentProps) => JSX.Element
}

export const loginModalContents: LoginModalContents = {
  login: LoginContent,
  'enter-secret-key': EnterSecretKeyContent,
  'subsocial-profile': SubsocialProfileContent,
  'account-created': AccountCreatedContent,
  'account-created-after-name-set': AccountCreatedContent,
  'evm-address-linked': CommonEvmAddressLinked,
  'evm-linking-error': EvmLoginError,
}
