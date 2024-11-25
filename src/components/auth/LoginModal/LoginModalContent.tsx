import IncognitoIcon from '@/assets/icons/incognito.svg'
import KeyIcon from '@/assets/icons/key.svg'
import Button from '@/components/Button'
import InfoPanel from '@/components/InfoPanel'
import Logo from '@/components/Logo'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import useIsInIframe from '@/hooks/useIsInIframe'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useLoginOption from '@/hooks/useLoginOption'
import useToastError from '@/hooks/useToastError'
import { useRequestToken } from '@/old/services/api/mutation'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getUrlQuery } from '@/utils/links'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { HiPlus } from 'react-icons/hi2'
import ScanQRButton from './ScanQRButton'
import { AccountCreatedContent } from './contents/AccountCreatedContent'
import { LoginWithGrillKeyContent } from './contents/LoginWithGrillKeyContent'
import NewAccountContent from './contents/NewAccountContent'
import ScanQrContent from './contents/ScanQrContent'
import SolanaConnectWalletContent from './contents/solana/SolanaLinkIdentityContent'
import SolanaSignMessageContent from './contents/solana/SolanaSignMessageContent'

export type LoginModalStep =
  | 'login'
  | 'scan-qr'
  | 'enter-secret-key'
  | 'new-account'
  | 'account-created'
  | 'solana-connect'
  | 'solana-connect-confirmation'

export type LoginModalContentProps = ModalFunctionalityProps & {
  setCurrentState: Dispatch<SetStateAction<LoginModalStep>>
  currentStep: LoginModalStep
  afterLogin?: () => void
  beforeLogin?: () => void
}

export const LoginContent = (props: LoginModalContentProps) => {
  const { setCurrentState } = props
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

  return (
    <div>
      <ScanQRButton {...props} />
      <div className='flex w-full flex-col justify-center'>
        <Logo className='mb-8 mt-4 text-5xl' />
        <div className={cx('flex flex-col gap-4')}>
          {loginOption === 'all' && (
            <Button
              variant='primary'
              onClick={() => {
                sendEvent('login_grill_key_clicked')
                setCurrentState('enter-secret-key')
              }}
              size='lg'
            >
              <div className='flex items-center justify-center gap-2'>
                <KeyIcon className='text-text-muted-on-primary' />
                Log in with Grill key
              </div>
            </Button>
          )}
          <Button
            variant={'primaryOutline'}
            onClick={() => {
              setCurrentState('solana-connect')
              sendEvent('login_polkadot_account_clicked')
            }}
            size='lg'
          >
            <div className='flex items-center justify-center gap-2'>
              Connect via Solana
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
              <div className='relative mb-4 flex items-center justify-center text-center text-text-muted'>
                <div className='absolute top-1/2 h-px w-full bg-background-lightest dark:bg-background-lightest/50' />
                <span className='relative inline-block bg-background-light px-4 text-xs'>
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
                size='lg'
                onClick={() => {
                  setCurrentState('new-account')
                  sendEvent('login_create_new_clicked')
                }}
              >
                <div className='flex items-center justify-center gap-2'>
                  <HiPlus className='text-[20px] text-text-muted' />
                  <div className='flex flex-col text-left'>
                    <span>Create new Grill account</span>
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
  'scan-qr': ScanQrContent,
  'enter-secret-key': LoginWithGrillKeyContent,
  'new-account': NewAccountContent,
  'account-created': AccountCreatedContent,
  'solana-connect': SolanaConnectWalletContent,
  'solana-connect-confirmation': SolanaSignMessageContent,
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
