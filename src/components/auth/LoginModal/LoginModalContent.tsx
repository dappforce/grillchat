import KeyIcon from '@/assets/icons/key.svg'
import WalletIcon from '@/assets/icons/wallet.svg'
import XLogoIcon from '@/assets/icons/x-logo.svg'
import {
  CommonEvmAddressLinked,
  CommonEVMLoginErrorContent,
} from '@/components/auth/common/evm/CommonEvmModalContent'
import Button from '@/components/Button'
import InfoPanel from '@/components/InfoPanel'
import Logo from '@/components/Logo'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useLoginOption from '@/hooks/useLoginOption'
import useSignMessageAndLinkEvmAddress from '@/hooks/useSignMessageAndLinkEvmAddress'
import useToastError from '@/hooks/useToastError'
import { useRequestToken } from '@/services/api/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { signIn } from 'next-auth/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CommonEvmSetProfileContent from '../common/evm/CommonEvmSetProfileContent'
import { CustomConnectButton } from '../common/evm/CustomConnectButton'
import LimitedPolkadotJsSupportContent from '../common/polkadot-connect/LimitedPolkadotJsSupportContent'
import PolkadotConnectAccountContent from '../common/polkadot-connect/PolkadotConnectAccountContent'
import PolkadotConnectConfirmationContent from '../common/polkadot-connect/PolkadotConnectConfirmationContent'
import PolkadotConnectSuccess from '../common/polkadot-connect/PolkadotConnectSuccess'
import PolkadotConnectWalletContent from '../common/polkadot-connect/PolkadotConnectWalletContent'
import { PolkadotConnectSteps } from '../common/polkadot-connect/types'
import { AccountCreatedContent } from './contents/AccountCreatedContent'
import { ConnectWalletContent } from './contents/ConnectWalletContent'
import { EnterSecretKeyContent } from './contents/EnterSecretKeyContent'
import { NextActionsContent } from './contents/NextActionsContent'
import XLoginLoading from './contents/XLoginLoadingContent'

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

export type LoginModalContentProps = ModalFunctionalityProps & {
  setCurrentState: Dispatch<SetStateAction<LoginModalStep>>
  currentStep: LoginModalStep
  afterLogin?: () => void
  beforeLogin?: () => void
}

export const LoginContent = ({ setCurrentState }: LoginModalContentProps) => {
  const { loginOption } = useLoginOption()
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
          {loginOption === 'all' && (
            <>
              {showErrorPanel && (
                <InfoPanel variant='error'>
                  😕 Sorry there is some issue with logging you in, please try
                  again or try different account
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
            </>
          )}
          <Button
            variant={loginOption === 'polkadot' ? 'primary' : 'primaryOutline'}
            onClick={() => {
              setCurrentState('connect-wallet')
              sendEvent('connect_wallet_started')
            }}
            size='lg'
          >
            <div className='flex items-center justify-center gap-2'>
              <WalletIcon
                className={cx(
                  loginOption === 'polkadot'
                    ? 'text-text-muted-on-primary'
                    : 'text-text-muted'
                )}
              />
              Connect wallet
            </div>
          </Button>
          {loginOption === 'all' && (
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
  'polkadot-js-limited-support': LimitedPolkadotJsSupportContent,
  'polkadot-connect-account': PolkadotConnectAccountContent,
  'polkadot-connect-confirmation': PolkadotConnectConfirmation,
  'polkadot-connect-success': PolkadotConnectSuccess,
}

function PolkadotConnectConfirmation({
  setCurrentState,
}: LoginModalContentProps) {
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

export function EvmLoginError({ setCurrentState }: LoginModalContentProps) {
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
export function LinkEvmContent({ setCurrentState }: LoginModalContentProps) {
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
