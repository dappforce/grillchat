import IncognitoIcon from '@/assets/icons/incognito.svg'
import KeyIcon from '@/assets/icons/key.svg'
import WalletIcon from '@/assets/icons/wallet.svg'
import Button from '@/components/Button'
import InfoPanel from '@/components/InfoPanel'
import Logo from '@/components/Logo'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import useIsInIframe from '@/hooks/useIsInIframe'
import useLogin from '@/hooks/useLogin'
import useLoginOption from '@/hooks/useLoginOption'
import useToastError from '@/hooks/useToastError'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getProfileQuery } from '@/services/api/query'
import { useSetReferrerId } from '@/services/datahub/referral/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getUrlQuery } from '@/utils/links'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { HiPlus } from 'react-icons/hi2'
import LimitedPolkadotJsSupportContent from '../common/polkadot-connect/LimitedPolkadotJsSupportContent'
import PolkadotConnectAccountContent from '../common/polkadot-connect/PolkadotConnectAccountContent'
import PolkadotConnectConfirmationContent from '../common/polkadot-connect/PolkadotConnectConfirmationContent'
import PolkadotConnectWalletContent from '../common/polkadot-connect/PolkadotConnectWalletContent'
import { PolkadotConnectSteps } from '../common/polkadot-connect/types'
import ScanQRButton from './ScanQRButton'
import { AccountCreatedContent } from './contents/AccountCreatedContent'
import { LoginWithGrillKeyContent } from './contents/LoginWithGrillKeyContent'
import NewAccountContent from './contents/NewAccountContent'
import ScanQrContent from './contents/ScanQrContent'
import { finishLogin } from './utils'

export type LoginModalStep =
  | PolkadotConnectSteps
  | 'login'
  | 'scan-qr'
  | 'enter-secret-key'
  | 'new-account'
  | 'account-created'

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

  const { mutateAsync: login, isLoading, error } = useLogin()
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
            variant={
              isConnectWalletPrimaryButton ? 'primary' : 'primaryOutline'
            }
            onClick={() => {
              setCurrentState('polkadot-connect')
              sendEvent('login_polkadot_account_clicked')
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
                const newAddress = await login(null)
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
  'polkadot-connect': PolkadotConnectWalletContent,
  'polkadot-js-limited-support': LimitedPolkadotJsSupportContent,
  'polkadot-connect-account': PolkadotConnectAccountContent,
  'polkadot-connect-confirmation': PolkadotConnectConfirmation,
}

function PolkadotConnectConfirmation({
  setCurrentState,
  closeModal,
}: LoginModalContentProps) {
  const connectedWalletAddress = useMyAccount(
    (state) => state.connectedWallet?.address
  )
  const { data: profile, isSuccess } = getProfileQuery.useQuery(
    connectedWalletAddress ?? ''
  )
  const { mutate: setReferrerId } = useSetReferrerId()

  const loginAsTemporaryAccount = useMyAccount.use.loginAsTemporaryAccount()
  const finalizeTemporaryAccount = useMyAccount.use.finalizeTemporaryAccount()

  return (
    <PolkadotConnectConfirmationContent
      closeModal={closeModal}
      setCurrentState={setCurrentState}
      onSuccess={() => {
        finalizeTemporaryAccount()
        if (!profile?.profileSpace?.id && isSuccess) {
          useLoginModal.getState().openNextStepModal({ step: 'create-profile' })
        } else {
          finishLogin(closeModal)
        }
      }}
      beforeAddProxy={async () => {
        await loginAsTemporaryAccount()
        setReferrerId({ refId: getReferralIdInUrl(), walletType: 'injected' })
        return true
      }}
    />
  )
}
