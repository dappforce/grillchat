import InfoPanel from '@/components/InfoPanel'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { loginModalContents, LoginModalStep } from './LoginModalContent'

const CaptchaInvisible = dynamic(
  () => import('@/components/captcha/CaptchaInvisible'),
  {
    ssr: false,
  }
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
    withFooter?: boolean
    finalizeTemporaryAccount?: boolean
  }
}

const modalHeader: ModalConfig = {
  login: {
    title: '🔐 Login',
    desc: '',
    withFooter: true,
  },
  'enter-secret-key': {
    title: '🔑 Grill secret key',
    desc: (
      <span className='flex flex-col'>
        <span>
          To access GrillChat, you need a Grill secret key. If you do not have
          one, just write your first chat message, and you will be given one.
        </span>
        <InfoPanel className='mt-4'>
          DO NOT enter the private key of an account that holds any funds,
          assets, NFTs, etc.
        </InfoPanel>
      </span>
    ),
    withBackButton: true,
    withFooter: true,
  },
  'account-created': {
    title: '🎉 Account created',
    desc: 'We have created an anonymous account for you. You can now use Grill.chat!',
    finalizeTemporaryAccount: true,
  },
  'next-actions': {
    title: '🎉 Unlock the Full Potential of Web3',
    desc: "By connecting an EVM or Polkadot address, you'll be able to use features such as donations and NFTs, display your identity, and much more.",
  },
  'connect-wallet': {
    title: '🔑 Connect Wallet',
    desc: 'Choose a wallet to connect to Grill.chat',
    withBackButton: (address) => !address,
    withoutDefaultPadding: true,
  },
  'evm-address-link': {
    title: '🔑 Connect EVM',
    desc: 'Create an on-chain proof to link your Grill account, allowing you to use and display ENS names and NFTs, and interact with ERC20s.',
    withBackButton: true,
    backToStep: 'connect-wallet',
  },
  'evm-address-linked': {
    title: '🎉 EVM address linked',
    desc: `Now you can use all of Grill's EVM features such as ERC-20 tokens, NFTs, and other smart contracts.`,
    finalizeTemporaryAccount: true,
  },
  'evm-linking-error': {
    title: '😕 Something went wrong',
    desc: 'This might be related to the transaction signature. You can try again, or come back to it later.',
    withBackButton: true,
    withFooter: false,
    backToStep: 'connect-wallet',
  },
  'evm-set-profile': {
    title: '🤔 Set as default identity?',
    desc: 'Do you want to set your EVM as your default address?',
  },
  'polkadot-connect': {
    title: '🔗 Connect Polkadot',
    desc: 'Choose a wallet to connect to Grill.chat',
    withBackButton: true,
    backToStep: 'connect-wallet',
    withoutDefaultPadding: true,
  },
  'polkadot-connect-account': {
    title: '🔗 Select an account',
    desc: 'Select an account to connect to Grill.chat.',
    withBackButton: true,
    backToStep: 'polkadot-connect',
    withoutDefaultPadding: true,
  },
  'polkadot-connect-confirmation': {
    title: '🔑 Link Confirmation',
    desc: 'Please confirm the connection in your Polkadot wallet.',
    withBackButton: true,
    backToStep: 'polkadot-connect-account',
  },
  'polkadot-connect-success': {
    title: '🎉 Polkadot account linked',
    desc: "Now you can use all of Grill's Polkadot features such as donations and NFTs, and display your Polkadot identity.",
    finalizeTemporaryAccount: true,
  },
}

export default function LoginModal({
  afterLogin,
  beforeLogin,
  initialOpenState = 'login',
  onBackClick,
  ...props
}: LoginModalProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [currentState, setCurrentState] =
    useState<LoginModalStep>(initialOpenState)

  const ModalContent = loginModalContents[currentState]
  const header = modalHeader[currentState]
  const {
    title,
    desc,
    withBackButton,
    withFooter,
    backToStep,
    withoutDefaultPadding,
  } = header
  const usedOnBackClick =
    onBackClick || (() => setCurrentState(backToStep || 'login'))

  useEffect(() => {
    if (props.isOpen) setCurrentState(initialOpenState)
    else {
      const { isTemporaryAccount, logout } = useMyAccount.getState()
      if (isTemporaryAccount) logout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen])

  useEffect(() => {
    if (header.finalizeTemporaryAccount) {
      const { finalizeTemporaryAccount } = useMyAccount.getState()
      finalizeTemporaryAccount()
    }
  }, [header])

  const address = useMyMainAddress()
  const showBackButton =
    typeof withBackButton === 'function'
      ? withBackButton(address)
      : withBackButton

  return (
    <Modal
      {...props}
      withFooter={withFooter}
      initialFocus={isTouchDevice() ? undefined : inputRef}
      title={title}
      withCloseButton
      description={desc}
      onBackClick={showBackButton ? usedOnBackClick : undefined}
      contentClassName={cx(withoutDefaultPadding && '!px-0 !pb-0')}
      titleClassName={cx(withoutDefaultPadding && 'px-6')}
      descriptionClassName={cx(withoutDefaultPadding && 'px-6')}
      closeModal={() => {
        if (currentState === 'evm-address-linked') {
          setCurrentState('evm-set-profile')
          return
        }
        props.closeModal()
      }}
    >
      <CaptchaInvisible>
        {(runCaptcha, termsAndService) => {
          return (
            <ModalContent
              setCurrentState={setCurrentState}
              currentStep={currentState}
              runCaptcha={runCaptcha}
              termsAndService={termsAndService}
              {...props}
            />
          )
        }}
      </CaptchaInvisible>
    </Modal>
  )
}
