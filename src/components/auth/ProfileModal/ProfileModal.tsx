import { CommonEvmAddressLinked } from '@/components/auth/CommonModalContent'
import Modal from '@/components/modals/Modal'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import React, { useEffect, useState } from 'react'
import AboutContent from './contents/AboutContent'
import AccountContent from './contents/AccountContent'
import EvmLoginError from './contents/EvmLoginError'
import LinkEvmAddressContent from './contents/LinkEvmAddressContent'
import LogoutContent from './contents/LogoutContent'
import PrivateKeyContent from './contents/PrivateKeyContent'
import ShareSessionContent from './contents/ShareSessionContent'
import UnlinkEvmConfirmationContent from './contents/UnlinkEvmConfirmationContent'
import { ContentProps, ModalState, ProfileModalProps } from './types'

const modalContents: {
  [key in ModalState]: (props: ContentProps) => JSX.Element
} = {
  account: AccountContent,
  'private-key': PrivateKeyContent,
  logout: LogoutContent,
  'share-session': ShareSessionContent,
  about: AboutContent,
  'link-evm-address': LinkEvmAddressContent,
  'evm-linking-error': EvmLoginError,
  'unlink-evm-confirmation': UnlinkEvmConfirmationContent,
  'evm-address-linked': CommonEvmAddressLinked,
}

export default function ProfileModal({
  address,
  notification,
  ...props
}: ProfileModalProps) {
  const [currentState, setCurrentState] = useState<ModalState>('account')
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  // const { disconnect } = useDisconnect()

  const { evmAddress: linkedEvmAddress } = accountData || {}

  useEffect(() => {
    // if (!linkedEvmAddress) {
    //   disconnect()
    // }
    if (props.isOpen) setCurrentState('account')
  }, [props.isOpen])

  const modalTitles: {
    [key in ModalState]: {
      title: React.ReactNode
      desc?: React.ReactNode
      withBackButton?: boolean
    }
  } = {
    account: { title: <span className='font-medium'>My Account</span> },
    logout: {
      title: '🤔 Did you back up your Grill secret key?',
      withBackButton: true,
    },
    'private-key': {
      title: '🔑 Grill secret key',
      withBackButton: true,
    },
    'share-session': {
      title: '💻 Share session',
      desc: 'Use this link or scan the QR code to quickly log in to this account on another device.',
      withBackButton: true,
    },
    about: {
      title: 'About app',
      desc: null,
      withBackButton: true,
    },
    'link-evm-address': {
      title: linkedEvmAddress ? '🔑 My EVM address' : '🔑 Link EVM Address',
      desc: 'Create an on-chain proof to link your Grill account, allowing you to use and display NFTs, and interact with ERC20s and smart contracts. ',
      withBackButton: true,
    },
    'evm-linking-error': {
      title: '😕 Something went wrong',
      desc: 'This might be related to the transaction signature. You can try again, or come back to it later.',
      withBackButton: false,
    },
    'unlink-evm-confirmation': {
      title: '🤔 Unlink EVM address?',
      desc: undefined,
      withBackButton: false,
    },
    'evm-address-linked': {
      title: '🎉 EVM address linked',
      desc: `Now you can use all of Grill's EVM features such as ERC-20 tokens, NFTs, and other smart contracts.`,
      withBackButton: false,
    },
  }

  const onBackClick = () => setCurrentState('account')
  const { title, desc, withBackButton } = modalTitles[currentState] || {}
  const Content = modalContents[currentState]

  const isAccountState = currentState === 'account'

  return (
    <Modal
      {...props}
      title={title}
      description={desc}
      contentClassName={cx(isAccountState && '!px-0 !pb-0')}
      titleClassName={cx(isAccountState && 'px-6')}
      withFooter={isAccountState}
      withCloseButton
      onBackClick={withBackButton ? onBackClick : undefined}
    >
      <Content
        address={address}
        setCurrentState={setCurrentState}
        notification={notification}
        evmAddress={linkedEvmAddress}
      />
    </Modal>
  )
}
