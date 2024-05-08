import KeyIcon from '@/assets/icons/key.svg'
import Button from '@/components/Button'
import InfoPanel from '@/components/InfoPanel'
import Logo from '@/components/Logo'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import { sendEventWithRef } from '@/components/referral/analytics'
import { useNeynarLogin } from '@/providers/config/NeynarLoginProvider'
import { getProfileQuery } from '@/services/api/query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useSetReferrerId } from '@/services/datahub/referral/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import {
  useMyAccount,
  useMyGrillAddress,
  useMyMainAddress,
} from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getUrlQuery } from '@/utils/links'
import { useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { HiPlus } from 'react-icons/hi2'
import { SiEthereum, SiFarcaster } from 'react-icons/si'
import { CommonEVMLoginContent } from '../common/evm/CommonEvmModalContent'
import ScanQRButton from './ScanQRButton'
import { AccountCreatedContent } from './contents/AccountCreatedContent'
import { LoginWithGrillKeyContent } from './contents/LoginWithGrillKeyContent'
import NewAccountContent from './contents/NewAccountContent'
import ScanQrContent from './contents/ScanQrContent'

export type LoginModalStep =
  | 'login'
  | 'scan-qr'
  | 'enter-secret-key'
  | 'new-account'
  | 'account-created'
  | 'evm-address-link'
  | 'evm-linking-error'

export type LoginModalContentProps = ModalFunctionalityProps & {
  setCurrentState: Dispatch<SetStateAction<LoginModalStep>>
  currentStep: LoginModalStep
  afterLogin?: () => void
  beforeLogin?: () => void
}

export const LoginContent = (props: LoginModalContentProps) => {
  const { setCurrentState, closeModal } = props
  const sendEvent = useSendEvent()
  const { loginNeynar, isLoadingOrSubmitted } = useNeynarLogin()
  const grillAddress = useMyGrillAddress()

  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    grillAddress ?? ''
  )
  useEffect(() => {
    if (linkedIdentity) {
      closeModal()
    }
  }, [linkedIdentity, closeModal])

  const [showErrorPanel, setShowErrorPanel] = useState(false)
  useEffect(() => {
    const auth = getUrlQuery('auth') === 'true'
    const error = getUrlQuery('error')
    // if user denied access to twitter (has suspended account)
    if (auth && error?.toLowerCase() === 'oauthcallback')
      setShowErrorPanel(true)
  }, [])

  return (
    <div>
      <ScanQRButton {...props} />
      <div className='flex w-full flex-col justify-center'>
        <Logo className='mb-8 mt-4 text-5xl' />
        <div className={cx('flex flex-col gap-4')}>
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
          <Button
            variant='primaryOutline'
            onClick={() => {
              sendEvent('login_neynar')
              loginNeynar()
            }}
            isLoading={isLoadingOrSubmitted}
            size='lg'
          >
            <div className='flex items-center justify-center gap-2'>
              <SiFarcaster className={cx('text-text-muted')} />
              Connect via Farcaster
            </div>
          </Button>
          <Button
            variant='primaryOutline'
            onClick={() => {
              sendEvent('login_evm_clicked')
              setCurrentState('evm-address-link')
            }}
            size='lg'
          >
            <div className='flex items-center justify-center gap-2'>
              <SiEthereum className={cx('text-text-muted')} />
              Connect via Wallet
            </div>
          </Button>
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
  'evm-address-link': EvmLoginStep,
  'evm-linking-error': (props) => <EvmLoginStep isErrorStep {...props} />,
}

export function EvmLoginStep({
  setCurrentState,
  isErrorStep,
  closeModal,
}: LoginModalContentProps & { isErrorStep?: boolean }) {
  const { mutate, isLoading } = useLoginBeforeSignEvm()
  const { mutate: setReferrerId } = useSetReferrerId()
  const sendEvent = useSendEvent()
  const client = useQueryClient()

  return (
    <CommonEVMLoginContent
      buttonLabel={isErrorStep ? 'Try again' : undefined}
      isLoading={isLoading}
      beforeSignEvmAddress={() => mutate()}
      onFinishSignMessage={() => {
        setReferrerId({ refId: getReferralIdInUrl() })
        // TODO: if want to have grill key step, uncomment this
        // useLoginModal
        //   .getState()
        //   .openNextStepModal({ step: 'save-grill-key', provider: 'evm' })
      }}
      onError={() => {
        setCurrentState('evm-linking-error')
      }}
      onSuccess={async (linkedIdentity) => {
        useMyAccount.getState().finalizeTemporaryAccount()

        const address = useMyAccount.getState().address
        sendEventWithRef(address ?? '', (refId) => {
          sendEvent('account_created', { loginBy: 'evm' }, { ref: refId })
        })

        const profile = await getProfileQuery.fetchQuery(
          null,
          linkedIdentity.mainAddress
        )
        if (!profile) {
          useLoginModal.getState().openNextStepModal({ step: 'create-profile' })
        }
        closeModal()
      }}
    />
  )
}
function useLoginBeforeSignEvm() {
  const [isCreatingAcc, setIsCreatingAcc] = useState(false)
  const loginAsTemporaryAccount = useMyAccount(
    (state) => state.loginAsTemporaryAccount
  )
  const myAddress = useMyMainAddress()

  return {
    mutate: async () => {
      if (myAddress) return

      setIsCreatingAcc(true)
      try {
        const address = await loginAsTemporaryAccount()
        if (!address) throw new Error('Login failed')
      } finally {
        setIsCreatingAcc(false)
      }
    },
    isLoading: isCreatingAcc,
  }
}
