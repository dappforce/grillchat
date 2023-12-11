import InfoPanel from '@/components/InfoPanel'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { loginModalContents, LoginModalStep } from './LoginModalContent'

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
    withCloseButton?: boolean
  }
}

const modalHeader: ModalConfig = {
  login: {
    title: '🔐 Login',
    desc: '',
    withFooter: true,
  },
  'enter-secret-key': {
    title: '🔑 Grill key',
    desc: (
      <span className='flex flex-col'>
        <span>
          To access GrillChat, you need a Grill key. If you do not have one,
          just write your first chat message, and you will be given one.
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
  'x-login-loading': {
    title: '🕔 Connecting to X',
    desc: '',
    withCloseButton: false,
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
    withCloseButton = true,
  } = header
  const usedOnBackClick =
    onBackClick || (() => setCurrentState(backToStep || 'login'))

  useEffect(() => {
    if (props.isOpen) setCurrentState(initialOpenState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen])

  // need to use useLayoutEffect to make finalize account works first before rendering any data inside the step
  // because this won't be called the step component calls closeModal inside the useEffect, e.g. 'polkadot-connect-success' step
  useLayoutEffect(() => {
    if (header.finalizeTemporaryAccount) {
      const { finalizeTemporaryAccount } = useMyAccount.getState()
      finalizeTemporaryAccount()
    }
  }, [header])

  const address = useMyMainAddress()
  const { data: accountData } = getAccountDataQuery.useQuery(address ?? '')
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
      withCloseButton={withCloseButton}
      description={desc}
      onBackClick={showBackButton ? usedOnBackClick : undefined}
      contentClassName={cx(withoutDefaultPadding && '!px-0 !pb-0')}
      titleClassName={cx(withoutDefaultPadding && 'px-6')}
      descriptionClassName={cx(withoutDefaultPadding && 'px-6')}
      closeModal={() => {
        if (
          currentState === 'evm-address-linked' &&
          (accountData?.ensNames?.length ?? 0) > 0
        ) {
          setCurrentState('evm-set-profile')
          return
        } else if (currentState === 'x-login-loading') {
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
  )
}
