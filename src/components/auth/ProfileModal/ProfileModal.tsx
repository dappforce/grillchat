import { CommonEvmAddressLinked } from '@/components/auth/CommonModalContent'
import Modal from '@/components/modals/Modal'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import React, { useEffect, useState } from 'react'
import AboutContent from './contents/AboutContent'
import AccountContent from './contents/AccountContent'
import EvmLoginError from './contents/evm-linking/EvmLoginError'
import LinkEvmAddressContent from './contents/evm-linking/LinkEvmAddressContent'
import UnlinkEvmConfirmationContent from './contents/evm-linking/UnlinkEvmConfirmationContent'
import LogoutContent from './contents/LogoutContent'
import NotificationContent from './contents/notifications/NotificationContent'
import PushNotificationContent from './contents/notifications/PushNotificationContent'
import TelegramNotificationContent from './contents/notifications/TelegramNotificationContent'
import PrivateKeyContent from './contents/PrivateKeyContent'
import ShareSessionContent from './contents/ShareSessionContent'
import SubsocialProfileContent from './contents/SubsocialProfileContent'
import { ContentProps, ModalState, ProfileModalProps } from './types'

const modalContents: {
  [key in ModalState]: (props: ContentProps) => JSX.Element
} = {
  account: AccountContent,
  'subsocial-profile': SubsocialProfileContent,
  'private-key': PrivateKeyContent,
  logout: LogoutContent,
  'share-session': ShareSessionContent,
  about: AboutContent,
  'link-evm-address': LinkEvmAddressContent,
  'evm-linking-error': EvmLoginError,
  'unlink-evm-confirmation': UnlinkEvmConfirmationContent,
  'evm-address-linked': CommonEvmAddressLinked,
  notifications: NotificationContent,
  'telegram-notifications': TelegramNotificationContent,
  'push-notifications': PushNotificationContent,
}

export default function ProfileModal({
  address,
  notification,
  step,
  ...props
}: ProfileModalProps) {
  // Prefetch telegram linked account data
  getLinkedTelegramAccountsQuery.useQuery(
    { address },
    {
      enabled: props.isOpen,
    }
  )

  const [currentState, setCurrentState] = useState<ModalState>(
    step || 'account'
  )
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const sendEvent = useSendEvent()

  const { evmAddress: linkedEvmAddress } = accountData || {}

  useEffect(() => {
    if (props.isOpen) {
      sendEvent('open_profile_modal')
      setCurrentState(step || 'account')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen])

  const modalTitles: {
    [key in ModalState]: {
      title: React.ReactNode
      desc?: React.ReactNode
      withBackButton?: boolean | ModalState
      withoutDefaultPadding?: boolean
      withFooter?: boolean
    }
  } = {
    account: {
      title: <span className='font-medium'>My Account</span>,
      withoutDefaultPadding: true,
      withFooter: true,
    },
    'subsocial-profile': {
      title: '🎩 Update nickname',
      desc: 'Create a name so other people can recognize you. You can change it at any time.',
      withBackButton: true,
    },
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
    notifications: {
      title: '🔔 Notifications',
      desc: 'Receive Grill.chat notifications in various locations',
      withBackButton: true,
      withoutDefaultPadding: true,
    },
    'telegram-notifications': {
      title: '🔔 Telegram bot',
      desc: 'Connect your account to our Telegram bot to receive notifications from Grill.',
      withBackButton: 'notifications',
    },
    'push-notifications': {
      title: '🔔 Push Notifications',
      desc: 'Push notifications allow you to receive direct updates from Grill in your browser.',
      withBackButton: 'notifications',
    },
  }

  const { title, desc, withBackButton, withoutDefaultPadding, withFooter } =
    modalTitles[currentState] || {}
  const onBackClick = () =>
    setCurrentState(
      typeof withBackButton === 'string' ? withBackButton : 'account'
    )
  const Content = modalContents[currentState]

  return (
    <Modal
      {...props}
      title={title}
      description={desc}
      contentClassName={cx(withoutDefaultPadding && '!px-0 !pb-0')}
      titleClassName={cx(withoutDefaultPadding && 'px-6')}
      descriptionClassName={cx(withoutDefaultPadding && 'px-6')}
      withFooter={withFooter}
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
