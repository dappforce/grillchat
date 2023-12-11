import { CommonEvmAddressLinked } from '@/components/auth/common/evm/CommonEvmModalContent'
import Modal from '@/components/modals/Modal'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import { SessionStorage } from '@/utils/storage'
import React, { useCallback, useEffect, useState } from 'react'
import CommonEvmSetProfileContent from '../common/evm/CommonEvmSetProfileContent'
import PolkadotConnectAccountContent from '../common/polkadot-connect/PolkadotConnectAccountContent'
import PolkadotConnectConfirmationContent from '../common/polkadot-connect/PolkadotConnectConfirmationContent'
import PolkadotConnectSuccess from '../common/polkadot-connect/PolkadotConnectSuccess'
import AboutContent from './contents/AboutContent'
import AccountContent from './contents/AccountContent'
import EvmLoginError from './contents/evm-linking/EvmLoginError'
import LinkEvmAddressContent from './contents/evm-linking/LinkEvmAddressContent'
import UnlinkEvmConfirmationContent from './contents/evm-linking/UnlinkEvmConfirmationContent'
import LinkedAddressesContent from './contents/LinkedAddressesContent'
import LogoutContent from './contents/LogoutContent'
import NotificationContent from './contents/notifications/NotificationContent'
import PushNotificationContent, {
  getPushNotificationUsableStatus,
} from './contents/notifications/PushNotificationContent'
import TelegramNotificationContent from './contents/notifications/TelegramNotificationContent'
import PolkadotConnectContent from './contents/polkadot-connect/PolkadotConnectContent'
import PolkadotConnectIdentityRemovedContent, {
  useHasPreviousGrillIdentity,
} from './contents/polkadot-connect/PolkadotConnectIdentityRemovedContent'
import PolkadotConnectUnlink from './contents/polkadot-connect/PolkadotConnectUnlink'
import PrivateKeyContent from './contents/PrivateKeyContent'
import ProfileSettingsContent from './contents/ProfileSettingsContent'
import ShareSessionContent from './contents/ShareSessionContent'
import { ContentProps, ProfileModalProps, ProfileModalState } from './types'

const modalContents: {
  [key in ProfileModalState]: (props: ContentProps) => JSX.Element
} = {
  account: AccountContent,
  'linked-addresses': LinkedAddressesContent,
  'profile-settings': ProfileSettingsContent,
  'private-key': PrivateKeyContent,
  logout: LogoutContent,
  'share-session': ShareSessionContent,
  about: AboutContent,
  'link-evm-address': LinkEvmAddressContent,
  'evm-linking-error': EvmLoginError,
  'unlink-evm-confirmation': UnlinkEvmConfirmationContent,
  'evm-address-linked': CommonEvmAddressLinked,
  'evm-set-profile-suggestion': ({ closeModal }) => (
    <CommonEvmSetProfileContent
      onSkipClick={closeModal}
      onSetEvmIdentityClick={() => {
        useProfileModal.getState().openModal({
          defaultOpenState: 'profile-settings',
          customInternalStepProps: { defaultTab: 'evm' },
        })
      }}
    />
  ),
  notifications: NotificationContent,
  'telegram-notifications': TelegramNotificationContent,
  'push-notifications': PushNotificationContent,
  'polkadot-connect': PolkadotConnectContent,
  'polkadot-connect-account': PolkadotConnectAccountContent,
  'polkadot-connect-confirmation': PolkadotConnectConfirmationContent,
  'polkadot-connect-success': PolkadotConnectSuccess,
  'polkadot-connect-unlink': PolkadotConnectUnlink,
  'polkadot-connect-set-profile': PolkadotConnectIdentityRemovedContent,
}

const pushNotificationDesc: Record<
  ReturnType<typeof getPushNotificationUsableStatus>,
  string
> = {
  'need-install':
    'Push notifications are not available in your browser. Please install Grill.chat to activate notifications.',
  unsupported: 'Push notifications are not available in your browser.',
  usable:
    'Push notifications allow you to receive direct updates from Grill in your browser.',
}

export const forceBackFlowStorage = new SessionStorage(
  () => 'force-back-profile-flow'
)

export default function ProfileModal({ notification }: ProfileModalProps) {
  const { isOpen, defaultOpenState, closeModal, onBackClick } =
    useProfileModal()

  const address = useMyMainAddress() ?? ''
  // Prefetch telegram linked account data
  getLinkedTelegramAccountsQuery.useQuery(
    { address },
    {
      enabled: isOpen,
    }
  )
  const hasPreviousIdentity = useHasPreviousGrillIdentity()

  const hasProxy = useMyAccount((state) => !!state.parentProxyAddress)
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)

  const [currentState, setCurrentState] = useState<ProfileModalState>(
    defaultOpenState || 'account'
  )
  const setCurrentStateAugmented = useCallback(
    (
      newData: Parameters<typeof setCurrentState>[0],
      forceBackFlowTo?: ProfileModalState
    ) => {
      setCurrentState((prevState) => {
        let data: ProfileModalState
        if (typeof newData === 'function') {
          data = newData(prevState)
        } else {
          data = newData
        }

        if (forceBackFlowTo)
          forceBackFlowStorage.set(
            JSON.stringify({ from: data, to: prevState })
          )

        if (data === 'account') {
          forceBackFlowStorage.remove()
        }

        return data
      })
    },
    []
  )

  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const sendEvent = useSendEvent()

  const { evmAddress: linkedEvmAddress, ensNames } = accountData || {}

  useEffect(() => {
    if (isOpen) {
      sendEvent('open_profile_modal')
      setCurrentStateAugmented(defaultOpenState || 'account')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultOpenState])

  const pushNotificationUsableStatus = getPushNotificationUsableStatus()
  const modalTitles: {
    [key in ProfileModalState]: {
      title: React.ReactNode
      desc?: React.ReactNode
      withBackButton?: boolean | ProfileModalState | (() => ProfileModalState)
      withoutDefaultPadding?: boolean
      withFooter?: boolean
    }
  } = {
    account: {
      title: <span className='font-medium'>My Account</span>,
      withoutDefaultPadding: true,
      withFooter: true,
    },
    'linked-addresses': {
      title: '🔗 Linked Addresses',
      desc: 'Link your EVM and Polkadot accounts to use features such as donations and NFTs, display your identity, and much more.',
      withBackButton: true,
      withoutDefaultPadding: true,
    },
    'profile-settings': {
      title: '✏️ Edit Profile',
      withBackButton: true,
    },
    logout: {
      title: '🤔 Did you back up your Grill key?',
      withBackButton: true,
    },
    'private-key': {
      title: '🔑 Grill key',
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
      title: linkedEvmAddress ? '🔑 My EVM address' : '🔑 Connect EVM',
      desc: 'Create an on-chain proof to link your Grill account, allowing you to use and display NFTs, and interact with ERC20s and smart contracts. ',
      withBackButton: 'linked-addresses',
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
    'evm-set-profile-suggestion': {
      title: '🤔 Set as default identity?',
      desc: 'Do you want to set your EVM as your default address?',
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
      desc: pushNotificationDesc[pushNotificationUsableStatus],
      withBackButton: 'notifications',
    },
    'polkadot-connect': {
      title: '🔗 Connect Polkadot',
      desc: hasProxy
        ? 'Use your Polkadot identity and enable donations, NFTs, and more.'
        : 'Choose a wallet to connect to Grill.chat',
      withBackButton: () => {
        if (!hasProxy) setPreferredWallet(null)
        return 'linked-addresses'
      },
      withoutDefaultPadding: true,
    },
    'polkadot-connect-account': {
      title: '🔗 Select an account',
      desc: 'Select an account to connect to Grill.chat',
      withBackButton: () => {
        setPreferredWallet(null)
        return 'polkadot-connect'
      },
      withoutDefaultPadding: true,
    },
    'polkadot-connect-confirmation': {
      title: '🔑 Link Confirmation',
      desc: 'Please confirm the connection in your Polkadot wallet.',
      withBackButton: 'polkadot-connect-account',
    },
    'polkadot-connect-success': {
      title: '🎉 Polkadot account linked',
      desc: "Now you can use all of Grill's Polkadot features such as donations and NFTs, and display your Polkadot identity.",
      withBackButton: false,
    },
    'polkadot-connect-unlink': {
      title: '🤔 Unlink Polkadot address?',
      desc: undefined,
      withBackButton: false,
    },
    'polkadot-connect-set-profile': {
      title: '😕 Go to Profile Settings?',
      desc: 'You can manage which identities to use as your name.',
      withBackButton: false,
    },
  }

  useEffect(() => {
    if (!isOpen) forceBackFlowStorage.remove()
  }, [isOpen])

  const { title, desc, withBackButton, withoutDefaultPadding, withFooter } =
    modalTitles[currentState] || {}
  const usedOnBackClick = () => {
    try {
      const data = JSON.parse(forceBackFlowStorage.get() || '{}') as any
      const { from, to } = data
      if (from === currentState) {
        setCurrentStateAugmented(to)
        return
      }
    } catch {}

    if (onBackClick) onBackClick()
    else if (typeof withBackButton === 'function')
      setCurrentStateAugmented(withBackButton())
    else
      setCurrentStateAugmented(
        typeof withBackButton === 'string' ? withBackButton : 'account'
      )
  }

  const augmentedCloseModal = () => {
    if (currentState === 'polkadot-connect-success' && hasPreviousIdentity) {
      setCurrentStateAugmented('polkadot-connect-set-profile')
    } else if (
      currentState === 'evm-address-linked' &&
      (ensNames?.length ?? 0) > 0
    ) {
      setCurrentStateAugmented('evm-set-profile-suggestion')
    } else closeModal()
  }
  const Content = modalContents[currentState]

  return (
    <Modal
      isOpen={isOpen}
      closeModal={augmentedCloseModal}
      title={title}
      description={desc}
      contentClassName={cx(withoutDefaultPadding && '!px-0 !pb-0')}
      titleClassName={cx(withoutDefaultPadding && 'px-6')}
      descriptionClassName={cx(withoutDefaultPadding && 'px-6')}
      withFooter={withFooter}
      withCloseButton
      onBackClick={withBackButton ? usedOnBackClick : undefined}
    >
      <Content
        address={address}
        setCurrentState={setCurrentStateAugmented}
        notification={notification}
        evmAddress={linkedEvmAddress}
        closeModal={augmentedCloseModal}
      />
    </Modal>
  )
}
