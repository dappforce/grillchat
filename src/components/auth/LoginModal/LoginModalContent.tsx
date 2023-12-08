import PotentialImage from '@/assets/graphics/potential.png'
import EthIcon from '@/assets/icons/eth.svg'
import IncognitoIcon from '@/assets/icons/incognito.svg'
import KeyIcon from '@/assets/icons/key.svg'
import PolkadotIcon from '@/assets/icons/polkadot.svg'
import WalletIcon from '@/assets/icons/wallet.svg'
import {
  CommonEvmAddressLinked,
  CommonEVMLoginErrorContent,
} from '@/components/auth/common/evm/CommonEvmModalContent'
import Button from '@/components/Button'
import CaptchaInvisible from '@/components/captcha/CaptchaInvisible'
import TextArea from '@/components/inputs/TextArea'
import Logo from '@/components/Logo'
import MenuList from '@/components/MenuList'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import ProfilePreview from '@/components/ProfilePreview'
import Toast from '@/components/Toast'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useLoginOptions from '@/hooks/useLoginOptions'
import useSignMessageAndLinkEvmAddress from '@/hooks/useSignMessageAndLinkEvmAddress'
import useToastError from '@/hooks/useToastError'
import { ApiRequestTokenResponse } from '@/pages/api/request-token'
import { useRequestToken } from '@/services/api/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useRef,
  useState,
} from 'react'
import { toast } from 'react-hot-toast'
import CommonEvmSetProfileContent from '../common/evm/CommonEvmSetProfileContent'
import { CustomConnectButton } from '../common/evm/CustomConnectButton'
import PolkadotConnectAccountContent from '../common/polkadot-connect/PolkadotConnectAccountContent'
import PolkadotConnectConfirmationContent from '../common/polkadot-connect/PolkadotConnectConfirmationContent'
import PolkadotConnectSuccess from '../common/polkadot-connect/PolkadotConnectSuccess'
import PolkadotConnectWalletContent from '../common/polkadot-connect/PolkadotConnectWalletContent'
import { PolkadotConnectSteps } from '../common/polkadot-connect/types'

export type LoginModalStep =
  | PolkadotConnectSteps
  | 'login'
  | 'enter-secret-key'
  | 'account-created'
  | 'next-actions'
  | 'connect-wallet'
  | 'evm-address-link'
  | 'evm-address-linked'
  | 'evm-linking-error'
  | 'evm-set-profile'

type ContentProps = ModalFunctionalityProps & {
  setCurrentState: Dispatch<SetStateAction<LoginModalStep>>
  currentStep: LoginModalStep
  runCaptcha: () => Promise<string | null>
  termsAndService: (className?: string) => JSX.Element
  afterLogin?: () => void
  beforeLogin?: () => void
}

export const LoginContent = ({
  setCurrentState,
  runCaptcha,
  termsAndService,
}: ContentProps) => {
  const [hasStartCaptcha, setHasStartCaptcha] = useState(false)
  const sendEvent = useSendEvent()
  const { isNonAnonLoginRequired } = useLoginOptions()

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
        <div
          className={cx(
            'flex flex-col gap-4',
            isNonAnonLoginRequired && 'pb-4'
          )}
        >
          <Button
            onClick={() => {
              setCurrentState('connect-wallet')
              sendEvent('connect_wallet_started')
            }}
            size='lg'
          >
            <div className='flex items-center justify-center gap-2'>
              <WalletIcon className='text-text-muted-on-primary' />
              Connect wallet
            </div>
          </Button>
          <Button
            variant='primaryOutline'
            onClick={() => setCurrentState('enter-secret-key')}
            size='lg'
          >
            <div className='flex items-center justify-center gap-2'>
              <KeyIcon className='text-text-muted' />
              Enter Grill secret key
            </div>
          </Button>
          {!isNonAnonLoginRequired && (
            <>
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
                    setCurrentState('account-created')
                  }
                }}
              >
                <div className='flex items-center justify-center gap-2'>
                  <IncognitoIcon className='text-text-muted' />
                  Continue anonymously
                </div>
              </Button>
              {termsAndService('mt-4')}
            </>
          )}
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

    const trimmedPk = privateKey.trim()
    if (await login(trimmedPk)) {
      afterLogin?.()
      sendEvent('login', { eventSource: 'login_modal' })
      setPrivateKey('')
      closeModal()
    } else {
      toast.custom((t) => (
        <Toast
          t={t}
          type='error'
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

export const AccountCreatedContent = ({ setCurrentState }: ContentProps) => {
  const address = useMyMainAddress()

  return (
    <div className='flex flex-col'>
      {address && (
        <div
          className={cx(
            'mb-6 mt-2 flex flex-col rounded-2xl bg-background-lighter p-4'
          )}
        >
          <ProfilePreview address={address} avatarClassName={cx('h-16 w-16')} />
        </div>
      )}
      <Button size='lg' onClick={() => setCurrentState('next-actions')}>
        Continue
      </Button>
    </div>
  )
}

export const NextActionsContent = ({
  setCurrentState,
  closeModal,
}: ContentProps) => {
  const sendEvent = useSendEvent()

  return (
    <div className='flex flex-col'>
      <Image src={PotentialImage} alt='' className='mb-6 w-full' />
      <div className='flex flex-col gap-4'>
        <Button size='lg' onClick={() => setCurrentState('connect-wallet')}>
          Connect Addresses
        </Button>
        <Button
          size='lg'
          variant='primaryOutline'
          onClick={() => {
            closeModal()
            sendEvent('connect_addresses_skiped')
          }}
        >
          I&apos;ll do this later
        </Button>
      </div>
    </div>
  )
}

export const ConnectWalletContent = ({ setCurrentState }: ContentProps) => {
  const sendEvent = useSendEvent()

  return (
    <MenuList
      className='pt-0'
      menus={[
        {
          text: 'EVM',
          icon: EthIcon,
          onClick: () => {
            setCurrentState('evm-address-link')
            sendEvent('start_link_evm_address')
          },
        },
        {
          text: 'Polkadot',
          icon: PolkadotIcon,
          onClick: () => {
            setCurrentState('polkadot-connect')
            sendEvent('start_link_polkadot_address')
          },
        },
      ]}
    />
  )
}

function useLoginBeforeSignEvm() {
  const [isCreatingAcc, setIsCreatingAcc] = useState(false)
  const { mutate: requestToken, error } = useRequestToken()
  const loginAsTemporaryAccount = useMyAccount(
    (state) => state.loginAsTemporaryAccount
  )
  const myAddress = useMyMainAddress()
  useToastError(error, 'Retry linking EVM address failed')

  return {
    mutate: async (runCaptcha: () => Promise<string | null>) => {
      if (myAddress) return

      setIsCreatingAcc(true)
      try {
        const captchaToken = await runCaptcha()
        if (!captchaToken) throw new Error('Captcha failed')
        const address = await loginAsTemporaryAccount()
        if (!address) throw new Error('Login failed')
        requestToken({ captchaToken, address })
      } finally {
        setIsCreatingAcc(false)
      }
    },
    isLoading: isCreatingAcc,
  }
}

export const EvmLoginError = ({ setCurrentState }: ContentProps) => {
  const { mutate, isLoading } = useLoginBeforeSignEvm()

  return (
    <CaptchaInvisible>
      {(runCaptcha) => (
        <CommonEVMLoginErrorContent
          isLoading={isLoading}
          beforeSignEvmAddress={() => mutate(runCaptcha)}
          setModalStep={() => setCurrentState('evm-address-linked')}
          signAndLinkOnConnect={true}
        />
      )}
    </CaptchaInvisible>
  )
}

export const LinkEvmContent = ({ setCurrentState }: ContentProps) => {
  const { mutate, isLoading: isLoggingIn } = useLoginBeforeSignEvm()

  const { signAndLinkEvmAddress, isLoading: isLinking } =
    useSignMessageAndLinkEvmAddress({
      setModalStep: () => setCurrentState('evm-address-linked'),
      onError: () => {
        setCurrentState('evm-linking-error')
      },
    })

  const isLoading = isLoggingIn || isLinking

  return (
    <CaptchaInvisible>
      {(runCaptcha) => (
        <CustomConnectButton
          className={cx('w-full')}
          beforeSignEvmAddress={() => mutate(runCaptcha)}
          signAndLinkEvmAddress={signAndLinkEvmAddress}
          isLoading={isLoading}
          secondLabel='Sign Message'
        />
      )}
    </CaptchaInvisible>
  )
}

const PolkadotConnectConfirmation = ({ setCurrentState }: ContentProps) => {
  const { mutateAsync, error } = useLoginAndRequestToken({
    asTemporaryAccount: true,
  })
  useToastError(error, 'Create account for polkadot connection failed')

  return (
    <CaptchaInvisible>
      {(runCaptcha) => (
        <PolkadotConnectConfirmationContent
          setCurrentState={setCurrentState}
          beforeAddProxy={async () => {
            const captchaToken = await runCaptcha()
            if (!captchaToken) return false
            await mutateAsync({ captchaToken })
            return true
          }}
        />
      )}
    </CaptchaInvisible>
  )
}

type LoginModalContents = {
  [key in LoginModalStep]: (props: ContentProps) => JSX.Element
}

export const loginModalContents: LoginModalContents = {
  login: LoginContent,
  'enter-secret-key': EnterSecretKeyContent,
  'account-created': AccountCreatedContent,
  'next-actions': NextActionsContent,
  'connect-wallet': ConnectWalletContent,
  'evm-address-link': LinkEvmContent,
  'evm-address-linked': CommonEvmAddressLinked,
  'evm-linking-error': EvmLoginError,
  'evm-set-profile': ({ closeModal }) => (
    <CommonEvmSetProfileContent
      onSkipClick={closeModal}
      onSetEvmIdentityClick={() => {
        useProfileModal.getState().openModal({
          defaultOpenState: 'profile-settings',
          customInternalStepProps: { defaultTab: 'evm' },
        })
        closeModal()
      }}
    />
  ),
  'polkadot-connect': PolkadotConnectWalletContent,
  'polkadot-connect-account': PolkadotConnectAccountContent,
  'polkadot-connect-confirmation': PolkadotConnectConfirmation,
  'polkadot-connect-success': PolkadotConnectSuccess,
}
