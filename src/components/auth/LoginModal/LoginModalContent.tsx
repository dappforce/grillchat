import PotentialImage from '@/assets/graphics/potential.png'
import LoadingHamster from '@/assets/graphics/processing-humster.png'
import EthIcon from '@/assets/icons/eth.svg'
import KeyIcon from '@/assets/icons/key.svg'
import PolkadotIcon from '@/assets/icons/polkadot.svg'
import WalletIcon from '@/assets/icons/wallet.svg'
import XLogoIcon from '@/assets/icons/x-logo.svg'
import {
  CommonEvmAddressLinked,
  CommonEVMLoginErrorContent,
} from '@/components/auth/common/evm/CommonEvmModalContent'
import Button from '@/components/Button'
import InfoPanel from '@/components/InfoPanel'
import TextArea from '@/components/inputs/TextArea'
import Logo from '@/components/Logo'
import MenuList from '@/components/MenuList'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import ProfilePreview from '@/components/ProfilePreview'
import Toast from '@/components/Toast'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useSignMessageAndLinkEvmAddress from '@/hooks/useSignMessageAndLinkEvmAddress'
import useToastError from '@/hooks/useToastError'
import { useRequestToken } from '@/services/api/mutation'
import { useLinkIdentity } from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useUpsertProfile } from '@/services/subsocial/profiles/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { useSubscriptionState } from '@/stores/subscription'
import { cx } from '@/utils/class-names'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { encodeProfileSource } from '@/utils/profile'
import { replaceUrl } from '@/utils/window'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
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
  | 'x-login-loading'
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
  afterLogin?: () => void
  beforeLogin?: () => void
}

export const LoginContent = ({ setCurrentState }: ContentProps) => {
  const sendEvent = useSendEvent()
  const [showErrorPanel, setShowErrorPanel] = useState(false)
  useEffect(() => {
    const auth = getUrlQuery('auth') === 'true'
    const error = getUrlQuery('error')
    // if user denied access to twitter (has suspended account)
    if (auth && error.toLowerCase() === 'oauthcallback') setShowErrorPanel(true)
  }, [])

  return (
    <div>
      <div className='flex w-full flex-col justify-center'>
        <Logo className='mb-8 mt-4 text-5xl' />
        <div className={cx('flex flex-col gap-4 pb-4')}>
          {showErrorPanel && (
            <InfoPanel variant='error'>
              😕 Sorry there is some issue with logging you in, please try again
              or try different account
            </InfoPanel>
          )}
          <Button
            onClick={() => {
              sendEvent('x_login_started')
              signIn('twitter', {
                callbackUrl: `${getCurrentUrlWithoutQuery()}?login=x`,
              })
            }}
            size='lg'
          >
            <div className='flex items-center justify-center gap-2'>
              <XLogoIcon className='text-text-muted-on-primary' />
              Continue with X
            </div>
          </Button>
          <Button
            variant='primaryOutline'
            onClick={() => {
              setCurrentState('connect-wallet')
              sendEvent('connect_wallet_started')
            }}
            size='lg'
          >
            <div className='flex items-center justify-center gap-2'>
              <WalletIcon className='text-text-muted' />
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
              Enter Grill key
            </div>
          </Button>
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
          description='The Grill key you provided is not valid'
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
        placeholder='Enter your Grill key'
      />
      <Button disabled={!privateKey} type='submit' size='lg'>
        Login
      </Button>
    </form>
  )
}

export const AccountCreatedContent = ({ setCurrentState }: ContentProps) => {
  const myAddress = useMyMainAddress()

  return (
    <div className='flex flex-col'>
      {myAddress && (
        <div
          className={cx(
            'mb-6 mt-2 flex flex-col rounded-2xl bg-background-lighter p-4'
          )}
        >
          <ProfilePreview
            address={myAddress}
            avatarClassName={cx('h-16 w-16')}
          />
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
    mutate: async () => {
      if (myAddress) return

      setIsCreatingAcc(true)
      try {
        const address = await loginAsTemporaryAccount()
        if (!address) throw new Error('Login failed')
        requestToken({ address })
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
    <CommonEVMLoginErrorContent
      isLoading={isLoading}
      beforeSignEvmAddress={() => mutate()}
      setModalStep={() => setCurrentState('evm-address-linked')}
      signAndLinkOnConnect={true}
    />
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
    <CustomConnectButton
      className={cx('w-full')}
      beforeSignEvmAddress={() => mutate()}
      signAndLinkEvmAddress={signAndLinkEvmAddress}
      isLoading={isLoading}
      secondLabel='Sign Message'
    />
  )
}

const PolkadotConnectConfirmation = ({ setCurrentState }: ContentProps) => {
  const { mutateAsync, error } = useLoginAndRequestToken({
    asTemporaryAccount: true,
  })
  useToastError(error, 'Create account for polkadot connection failed')

  return (
    <PolkadotConnectConfirmationContent
      setCurrentState={setCurrentState}
      beforeAddProxy={async () => {
        await mutateAsync(null)
        return true
      }}
    />
  )
}

const XLoginLoading = ({ closeModal, setCurrentState }: ContentProps) => {
  const sendEvent = useSendEvent()

  const { data: session, status } = useSession()
  const { mutateAsync: loginAsTemporaryAccount } = useLoginAndRequestToken({
    asTemporaryAccount: true,
  })

  const myAddress = useMyMainAddress()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    myAddress ?? ''
  )
  const { mutate: linkIdentity } = useLinkIdentity()
  const { mutate: upsertProfile } = useUpsertProfile({
    onSuccess: () => {
      replaceUrl(getCurrentUrlWithoutQuery('login'))
      setCurrentState('account-created')
      sendEvent('x_login_done')
    },
  })

  const setSubscriptionState = useSubscriptionState(
    (state) => state.setSubscriptionState
  )
  useEffect(() => {
    setSubscriptionState('identity', 'always-sub')
    return () => {
      setSubscriptionState('identity', 'dynamic')
    }
  }, [setSubscriptionState])

  const upsertedProfile = useRef(false)
  useEffect(() => {
    const foundIdentity =
      linkedIdentity &&
      session &&
      linkedIdentity?.externalId === session?.user?.id
    if (foundIdentity && !upsertedProfile.current) {
      sendEvent('x_login_creating_profile', undefined, { twitterLinked: true })
      upsertedProfile.current = true
      upsertProfile({
        content: {
          image: session?.user?.image ?? '',
          name: session?.user.name ?? '',
          profileSource: encodeProfileSource({
            source: 'subsocial-profile',
          }),
        },
      })
    }
  }, [linkedIdentity, sendEvent, session, setCurrentState, upsertProfile])

  const isAlreadyCalled = useRef(false)
  useEffect(() => {
    if (status === 'unauthenticated') {
      closeModal()
      return
    }
    if (isAlreadyCalled.current || !session) return

    isAlreadyCalled.current = true
    sendEvent('x_login_linking')
    ;(async () => {
      const address = await loginAsTemporaryAccount(null)
      if (!address) return
      linkIdentity({
        id: session.user?.id,
        provider: IdentityProvider.TWITTER,
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  return (
    <div className='flex flex-col items-center'>
      <Image
        src={LoadingHamster}
        className='w-64 max-w-xs rounded-full'
        alt='loading'
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
  'x-login-loading': XLoginLoading,
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
