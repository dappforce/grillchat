import IncognitoIcon from '@/assets/icons/incognito.svg'
import KeyIcon from '@/assets/icons/key.svg'
import WalletIcon from '@/assets/icons/wallet.svg'
import {
  CommonEvmAddressLinked,
  CommonEVMLoginErrorContent,
} from '@/components/auth/common/evm/CommonEvmModalContent'
import Button from '@/components/Button'
import InfoPanel from '@/components/InfoPanel'
import Logo from '@/components/Logo'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import useIsInIframe from '@/hooks/useIsInIframe'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useLoginOption from '@/hooks/useLoginOption'
import useSignMessageAndLinkEvmAddress from '@/hooks/useSignMessageAndLinkEvmAddress'
import useToastError from '@/hooks/useToastError'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { useRequestToken } from '@/services/api/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getUrlQuery } from '@/utils/links'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { HiPlus } from 'react-icons/hi2'
import { CustomConnectButton } from '../common/evm/CustomConnectButton'
import LimitedPolkadotJsSupportContent from '../common/polkadot-connect/LimitedPolkadotJsSupportContent'
import PolkadotConnectAccountContent from '../common/polkadot-connect/PolkadotConnectAccountContent'
import PolkadotConnectConfirmationContent from '../common/polkadot-connect/PolkadotConnectConfirmationContent'
import PolkadotConnectWalletContent from '../common/polkadot-connect/PolkadotConnectWalletContent'
import { PolkadotConnectSteps } from '../common/polkadot-connect/types'
import { AccountCreatedContent } from './contents/AccountCreatedContent'
import { LoginWithGrillKeyContent } from './contents/LoginWithGrillKeyContent'
import NewAccountContent from './contents/NewAccountContent'

export type LoginModalStep =
  | PolkadotConnectSteps
  | 'login'
  | 'enter-secret-key'
  | 'new-account'
  | 'account-created'
  | 'evm-address-link'
  | 'evm-address-linked'
  | 'evm-linking-error'

export type LoginModalContentProps = ModalFunctionalityProps & {
  setCurrentState: Dispatch<SetStateAction<LoginModalStep>>
  currentStep: LoginModalStep
  afterLogin?: () => void
  beforeLogin?: () => void
}

export const LoginContent = ({ setCurrentState }: LoginModalContentProps) => {
  const { loginOption } = useLoginOption()
  const sendEvent = useSendEvent()

  const {
    mutateAsync: loginAndRequestToken,
    isLoading,
    error,
  } = useLoginAndRequestToken()
  useToastError(error, 'Login failed')

  const { loginRequired } = useConfigContext()
  const isInIframe = useIsInIframe()

  const [showErrorPanel, setShowErrorPanel] = useState(false)
  useEffect(() => {
    const auth = getUrlQuery('auth') === 'true'
    const error = getUrlQuery('error')
    // if user denied access to twitter (has suspended account)
    if (auth && error.toLowerCase() === 'oauthcallback') setShowErrorPanel(true)
  }, [])

  const canUseAnonLogin = !loginRequired
  const isConnectWalletPrimaryButton = loginOption === 'polkadot'

  return (
    <div>
      <div className='flex w-full flex-col justify-center'>
        <Logo className='mb-8 mt-4 text-5xl' />
        <div className={cx('flex flex-col gap-4')}>
          {loginOption === 'all' && (
            <Button
              variant='primary'
              onClick={() => setCurrentState('enter-secret-key')}
              size='lg'
            >
              <div className='flex items-center justify-center gap-2'>
                <KeyIcon className='text-text-muted-on-primary' />
                Log in with Grill key
              </div>
            </Button>
          )}
          <Button
            variant={
              isConnectWalletPrimaryButton ? 'primary' : 'primaryOutline'
            }
            onClick={() => {
              setCurrentState('polkadot-connect')
              sendEvent('connect_wallet_started')
            }}
            size='lg'
          >
            <div className='flex items-center justify-center gap-2'>
              <WalletIcon
                className={cx(
                  isConnectWalletPrimaryButton
                    ? 'text-text-muted-on-primary'
                    : 'text-text-muted'
                )}
              />
              Connect via Polkadot
            </div>
          </Button>
          {loginOption === 'all' && canUseAnonLogin && isInIframe && (
            <Button
              type='button'
              size='lg'
              className='w-full'
              variant='primaryOutline'
              isLoading={isLoading}
              onClick={async () => {
                sendEvent('login_anonymously')
                const newAddress = await loginAndRequestToken(null)
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
          )}
          {!isInIframe && (
            <div className='mt-1 flex flex-col'>
              <div className='relative mb-4 text-center text-text-muted'>
                <div className='absolute top-1/2 h-px w-full bg-background-lightest dark:bg-background-lightest/50' />
                <span className='relative inline-block bg-background-light px-4 text-sm'>
                  OR
                </span>
              </div>
              {showErrorPanel && (
                <InfoPanel variant='error' className='mb-4'>
                  😕 Sorry there is some issue with logging you in, please try
                  again or try different account
                </InfoPanel>
              )}
              <Button
                variant='primaryOutline'
                onClick={() => setCurrentState('new-account')}
              >
                <div className='flex items-center justify-center gap-2'>
                  <HiPlus className='text-[20px] text-text-muted' />
                  <div className='flex flex-col text-left'>
                    <span>Create new account</span>
                    <span className='text-sm text-text-muted'>
                      via Metamask, X, Google
                    </span>
                  </div>
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type LoginModalContents = {
  [key in LoginModalStep]: (props: LoginModalContentProps) => JSX.Element
}
export const loginModalContents: LoginModalContents = {
  login: LoginContent,
  'enter-secret-key': LoginWithGrillKeyContent,
  'new-account': NewAccountContent,
  'account-created': AccountCreatedContent,
  'evm-address-link': LinkEvmContent,
  'evm-address-linked': CommonEvmAddressLinked,
  'evm-linking-error': EvmLoginError,
  'polkadot-connect': PolkadotConnectWalletContent,
  'polkadot-js-limited-support': LimitedPolkadotJsSupportContent,
  'polkadot-connect-account': PolkadotConnectAccountContent,
  'polkadot-connect-confirmation': PolkadotConnectConfirmation,
}

function PolkadotConnectConfirmation({
  setCurrentState,
  closeModal,
}: LoginModalContentProps) {
  const { mutateAsync, error } = useLoginAndRequestToken({
    asTemporaryAccount: true,
  })
  const finalizeTemporaryAccount = useMyAccount.use.finalizeTemporaryAccount()
  useToastError(error, 'Create account for polkadot connection failed')

  return (
    <PolkadotConnectConfirmationContent
      closeModal={closeModal}
      setCurrentState={setCurrentState}
      onSuccess={() => {
        finalizeTemporaryAccount()
      }}
      beforeAddProxy={async () => {
        await mutateAsync(null)
        return true
      }}
    />
  )
}

export function EvmLoginError({ setCurrentState }: LoginModalContentProps) {
  const { mutate, isLoading } = useLoginBeforeSignEvm()

  return (
    <CommonEVMLoginErrorContent
      isLoading={isLoading}
      beforeSignEvmAddress={() => mutate()}
      onFinishSignMessage={() =>
        useLoginModal
          .getState()
          .openNextStepModal({ step: 'save-grill-key', provider: 'evm' })
      }
      onSuccess={() => setCurrentState('evm-address-linked')}
    />
  )
}
export function LinkEvmContent({ setCurrentState }: LoginModalContentProps) {
  const { mutate, isLoading: isLoggingIn } = useLoginBeforeSignEvm()

  const { signAndLinkEvmAddress, isLoading: isLinking } =
    useSignMessageAndLinkEvmAddress({
      onFinishSignMessage: () => {
        useLoginModal
          .getState()
          .openNextStepModal({ step: 'save-grill-key', provider: 'evm' })
      },
      onSuccess: () => {
        setCurrentState('evm-address-linked')
        useMyAccount.getState().finalizeTemporaryAccount()
      },
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
