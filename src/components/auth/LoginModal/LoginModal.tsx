import { linkTextStyles } from '@/components/LinkText'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import useLoginOption from '@/hooks/useLoginOption'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useLoginModal } from '@/stores/login-modal'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import SaveGrillKeyModal from '../SaveGrillKeyModal'
import { LimitedPolkadotJsSupportExplanation } from '../common/polkadot-connect/LimitedPolkadotJsSupportContent'
import { LoginModalStep, loginModalContents } from './LoginModalContent'

const StayUpdatedModal = dynamic(
  () => import('@/components/chats/StayUpdatedModal'),
  { ssr: false }
)

export type LoginModalProps = ModalFunctionalityProps & {
  initialOpenState?: LoginModalStep
  onBackClick?: () => void
  afterLogin?: () => void
  beforeLogin?: () => void
}

type ModalConfig = {
  [key in LoginModalStep]: {
    title: React.ReactNode
    desc: React.ReactNode
    withoutDefaultPadding?: boolean
    backToStep?: LoginModalStep
    withBackButton?: boolean | ((address: string | null) => boolean)
    withFooter?: 'privacy-policy' | 'dont-have-account'
    withCloseButton?: boolean
  }
}

export default function LoginModal({
  afterLogin,
  beforeLogin,
  initialOpenState = 'login',
  onBackClick,
  ...props
}: LoginModalProps) {
  const openedNextStepsModal = useLoginModal.use.openedNextStepModal()
  const closeNextStepModal = useLoginModal.use.closeNextStepModal()

  const [isOpenStayUpdatedModal, setIsOpenStayUpdatedModal] = useState(false)
  const { loginOption } = useLoginOption()

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [currentState, setCurrentState] =
    useState<LoginModalStep>(initialOpenState)

  const ModalContent = loginModalContents[currentState]

  const modalHeader: ModalConfig = {
    login: {
      title: '🔐 Login',
      desc: '',
      withFooter: 'privacy-policy',
    },
    'enter-secret-key': {
      title: '🔑 Log in with Grill key',
      desc: 'Grill key is like a long password and consists of 12 words',
      withBackButton: true,
      withFooter: 'dont-have-account',
    },
    'new-account': {
      title: '🔑 New Grill account',
      desc: 'Choose an authentication method from the options below to create a new Grill account.',
      withBackButton: true,
    },
    'x-login-loading': {
      title: '🕔 Connecting to X',
      desc: 'We are connecting your X account to Grill.chat. Please wait for a few seconds.',
      withCloseButton: false,
    },
    'google-login-loading': {
      title: '🕔 Connecting to Google',
      desc: 'We are connecting your Google account to Grill.chat. Please wait for a few seconds.',
      withCloseButton: false,
    },
    'account-created': {
      title: '🎉 Account created',
      desc: 'We have created an account linked to your X for you. You can now use Grill.chat!',
    },
    'evm-address-link': {
      title: '🔑 Connect EVM',
      desc: 'Create an on-chain proof to link your Grill account, allowing you to use and display ENS names and NFTs, and interact with ERC20s.',
      withBackButton: true,
      backToStep: 'new-account',
    },
    'evm-address-linked': {
      title: '🎉 EVM address linked',
      desc: `Now you can use all of Grill's EVM features such as ERC-20 tokens, NFTs, and other smart contracts.`,
    },
    'evm-linking-error': {
      title: '😕 Something went wrong',
      desc: 'This might be related to the transaction signature. You can try again, or come back to it later.',
      withBackButton: true,
      backToStep: 'new-account',
    },
    'polkadot-connect': {
      title: '🔗 Connect via Polkadot',
      desc: 'Select a wallet to connect to Grill using an existing Polkadot account',
      withBackButton: true,
      withoutDefaultPadding: true,
    },
    'polkadot-js-limited-support': {
      title: '🔗 Limited Polkadot.js Support',
      desc: (
        <LimitedPolkadotJsSupportExplanation
          goToWalletSelection={() => setCurrentState('polkadot-connect')}
        />
      ),
      backToStep: 'polkadot-connect',
      withBackButton: true,
    },
    'polkadot-connect-account': {
      title: '🔗 Select an account',
      desc: 'Select an account to connect to Grill.chat',
      withBackButton: true,
      backToStep: 'polkadot-connect',
      withoutDefaultPadding: true,
    },
    'polkadot-connect-confirmation': {
      title: '🔑 Link Your Account',
      desc: 'Confirm the account connection in your Polkadot wallet',
      withBackButton: true,
      backToStep: 'polkadot-connect-account',
    },
    'polkadot-connect-success': {
      title:
        loginOption === 'polkadot'
          ? '🎉 Chat joined!'
          : '🎉 Polkadot account linked',
      desc:
        loginOption === 'polkadot'
          ? 'Here, you can talk about the Active Staking system with others, and share which promising authors you are following.'
          : "Now you can use all of Grill's Polkadot features such as donations and NFTs, and display your Polkadot identity.",
    },
  }

  const header = modalHeader[currentState]
  const {
    title,
    desc,
    withBackButton,
    withFooter,
    backToStep,
    withoutDefaultPadding,
    withCloseButton = true,
  } = header
  const usedOnBackClick =
    onBackClick || (() => setCurrentState(backToStep || 'login'))

  useEffect(() => {
    if (props.isOpen) setCurrentState(initialOpenState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen])

  const address = useMyMainAddress()
  const { data: accountData } = getAccountDataQuery.useQuery(address ?? '')
  const showBackButton =
    typeof withBackButton === 'function'
      ? withBackButton(address)
      : withBackButton

  let footer: React.ReactNode | true | undefined
  if (withFooter === 'privacy-policy') {
    footer = true
  } else if (withFooter === 'dont-have-account') {
    footer = (
      <div className='flex flex-col items-center gap-0.5 p-4 pb-4 pt-3 text-center'>
        <span className='text-text-muted'>Don&apos;t have an account?</span>
        <button
          className={linkTextStyles({ variant: 'primary' })}
          onClick={() => {
            setCurrentState('new-account')
          }}
        >
          Create a new one
        </button>
      </div>
    )
  }

  return (
    <>
      <Modal
        {...props}
        className={cx(
          'transition-opacity',
          openedNextStepsModal?.step && 'opacity-0'
        )}
        withFooter={footer}
        initialFocus={isTouchDevice() ? undefined : inputRef}
        title={title}
        withCloseButton={withCloseButton}
        description={desc}
        onBackClick={showBackButton ? usedOnBackClick : undefined}
        contentClassName={cx(withoutDefaultPadding && '!px-0 !pb-0')}
        titleClassName={cx(withoutDefaultPadding && 'px-6')}
        descriptionClassName={cx(withoutDefaultPadding && 'px-6')}
        closeModal={() => {
          if (
            loginOption === 'polkadot' &&
            currentState === 'polkadot-connect-success'
          ) {
            props.closeModal()
            setIsOpenStayUpdatedModal(true)
            return
          }

          props.closeModal()
        }}
      >
        <ModalContent
          setCurrentState={setCurrentState}
          currentStep={currentState}
          {...props}
        />
      </Modal>
      {loginOption === 'polkadot' && (
        <StayUpdatedModal
          isOpen={isOpenStayUpdatedModal}
          closeModal={() => setIsOpenStayUpdatedModal(false)}
        />
      )}
      <SaveGrillKeyModal
        isOpen={openedNextStepsModal?.step === 'save-grill-key'}
        closeModal={() => {
          closeNextStepModal()
        }}
        provider={
          openedNextStepsModal?.step === 'save-grill-key'
            ? openedNextStepsModal.provider
            : undefined
        }
      />
    </>
  )
}
