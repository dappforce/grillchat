import { linkTextStyles } from '@/components/LinkText'
import Modal from '@/components/modals/Modal'
import useLoginOption from '@/hooks/useLoginOption'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { useEffect, useRef, useState } from 'react'
import CreateProfileModal from './CreateProfileModal'
import { LoginModalStep, loginModalContents } from './LoginModalContent'
import SaveGrillKeyModal from './SaveGrillKeyModal'
import { prevScanQrStep } from './ScanQRButton'

export type LoginModalProps = {
  onBackClick?: () => void
  disableOutsideClickClose?: boolean
  withoutOverlay?: boolean
  withoutShadow?: boolean
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
  onBackClick,
  disableOutsideClickClose,
  withoutOverlay,
  withoutShadow,
}: LoginModalProps) {
  const sendEvent = useSendEvent()
  const isOpen = useLoginModal.use.isOpen()
  const setIsOpen = useLoginModal.use.setIsOpen()
  const initialOpenState = useLoginModal.use.initialOpenState() || 'login'

  const openedNextStepsModal = useLoginModal.use.openedNextStepModal()
  const closeNextStepModal = useLoginModal.use.closeNextStepModal()

  // const [isOpenStayUpdatedModal, setIsOpenStayUpdatedModal] = useState(false)
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
      withCloseButton: false,
    },
    'enter-secret-key': {
      title: '🔑 Log in with Grill key',
      desc: 'Grill key is like a long password and consists of 12 words',
      withBackButton: true,
      withFooter: 'dont-have-account',
    },
    'scan-qr': {
      title: '📷 Scan QR Code',
      desc: 'Scan the QR code with your Grill mobile app to log in',
      withBackButton: true,
      backToStep: prevScanQrStep || 'login',
    },
    'new-account': {
      title: '🔑 New Grill account',
      desc: 'Choose an authentication method from the options below to create a new Grill account.',
      withBackButton: true,
    },
    'account-created': {
      title: '🎉 Account created',
      desc: 'We have created an account linked to your X for you. You can now use Grill!',
    },
    'evm-address-link': {
      title: '🔑 Connect EVM',
      desc: 'Create an on-chain proof to link your Grill account, allowing you to use and display ENS names and NFTs, and interact with ERC20s.',
      withBackButton: true,
      backToStep: 'new-account',
    },
    'evm-linking-error': {
      title: '😕 Something went wrong',
      desc: 'This might be related to the transaction signature. You can try again, or come back to it later.',
      withBackButton: true,
      backToStep: 'new-account',
    },
    // 'polkadot-connect': {
    //   title: '🔗 Connect via Polkadot',
    //   desc: 'Select a wallet to connect to Grill using an existing Polkadot account',
    //   withBackButton: true,
    //   withoutDefaultPadding: true,
    // },
    'solana-connect': {
      title: '🔗 Connect via Solana',
      desc: 'Select a wallet to connect to Grill using an existing Solana account',
      withBackButton: true,
      withoutDefaultPadding: true,
    },
    'solana-connect-confirmation': {
      title: '🔑 Link Your Account',
      desc: 'Confirm the account connection in your Solana wallet',
      withBackButton: true,
      backToStep: 'solana-connect',
    },
    // 'polkadot-js-limited-support': {
    //   title: '🔗 Limited Polkadot.js Support',
    //   desc: (
    //     <LimitedPolkadotJsSupportExplanation
    //       goToWalletSelection={() => setCurrentState('polkadot-connect')}
    //     />
    //   ),
    //   backToStep: 'polkadot-connect',
    //   withBackButton: true,
    // },
    // 'polkadot-connect-account': {
    //   title: '🔗 Select an account',
    //   desc: 'Select an account to connect to Grill',
    //   withBackButton: true,
    //   backToStep: 'polkadot-connect',
    //   withoutDefaultPadding: true,
    // },
    // 'polkadot-connect-confirmation': {
    //   title: '🔑 Link Your Account',
    //   desc: 'Confirm the account connection in your Polkadot wallet',
    //   withBackButton: true,
    //   backToStep: 'polkadot-connect-account',
    // },
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
    onBackClick ||
    (() => {
      setCurrentState(backToStep || 'login')
      if (currentState === 'enter-secret-key') {
        sendEvent('login_grill_key_back_clicked')
      }
    })

  useEffect(() => {
    if (isOpen) setCurrentState(initialOpenState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const address = useMyMainAddress()
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
            setCurrentState('login')
            sendEvent('login_grill_key_create_new_clicked')
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
        withoutOverlay={withoutOverlay}
        withoutShadow={withoutShadow}
        isOpen={isOpen}
        className={cx(
          'transition-opacity',
          openedNextStepsModal?.step && 'opacity-0'
        )}
        withFooter={footer}
        initialFocus={isTouchDevice() ? undefined : inputRef}
        title={title}
        withCloseButton={!disableOutsideClickClose && withCloseButton}
        description={desc}
        onBackClick={showBackButton ? usedOnBackClick : undefined}
        contentClassName={cx(withoutDefaultPadding && '!px-0 !pb-0')}
        titleClassName={cx(withoutDefaultPadding && 'px-6')}
        descriptionClassName={cx(withoutDefaultPadding && 'px-6')}
        closeModal={() => {
          if (disableOutsideClickClose) return

          setIsOpen(false)
          // if (loginOption === 'polkadot') {
          //   setIsOpenStayUpdatedModal(true)
          // }
        }}
      >
        <ModalContent
          setCurrentState={setCurrentState}
          currentStep={currentState}
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
        />
      </Modal>
      {/* {loginOption === 'polkadot' && (
        <StayUpdatedModal
          isOpen={isOpenStayUpdatedModal}
          closeModal={() => setIsOpenStayUpdatedModal(false)}
        />
      )} */}
      <SaveGrillKeyModal
        withoutOverlay={withoutOverlay}
        withoutShadow={withoutShadow}
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
      <CreateProfileModal
        withoutOverlay={withoutOverlay}
        withoutShadow={withoutShadow}
        isOpen={openedNextStepsModal?.step === 'create-profile'}
        closeModal={() => {
          closeNextStepModal()
        }}
      />
    </>
  )
}
