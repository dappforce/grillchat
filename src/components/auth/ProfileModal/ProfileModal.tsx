import DynamicLoadedHamsterLoading from '@/components/DynamicLoadedHamsterLoading'
import { CommonEvmAddressLinked } from '@/components/auth/common/evm/CommonEvmModalContent'
import useRedirectToNewChatPage from '@/components/community/useRedirectToNewChatPage'
import Modal, { ModalProps } from '@/components/modals/Modal'
import { getLinkedTelegramAccountsQuery } from '@/old/services/api/notifications/query'
import { getProfileQuery } from '@/old/services/api/query'
import { getAccountDataQuery } from '@/old/services/subsocial/evmAddresses'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import { SessionStorage } from '@/utils/storage'
import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useEffect, useState } from 'react'
import CommonEvmSetProfileContent from '../common/evm/CommonEvmSetProfileContent'
import LimitedPolkadotJsSupportContent, {
  LimitedPolkadotJsSupportExplanation,
} from '../common/polkadot-connect/LimitedPolkadotJsSupportContent'
import PolkadotConnectAccountContent from '../common/polkadot-connect/PolkadotConnectAccountContent'
import PolkadotConnectConfirmationContent from '../common/polkadot-connect/PolkadotConnectConfirmationContent'
import AboutContent from './contents/AboutContent'
import AccountContent from './contents/AccountContent'
import {
  CreateChatContent,
  CreateChatLoadingContent,
} from './contents/CreateChatContent'
import LinkedAddressesContent from './contents/LinkedAddressesContent'
import LogoutContent from './contents/LogoutContent'
import PrivacySecurityContent from './contents/PrivacySecurityContent'
import PrivateKeyContent from './contents/PrivateKeyContent'
import SimpleProfileSettingsContent from './contents/ProfileSettingsContent/SimpleProfileSettingsContent'
import ShareSessionContent from './contents/ShareSessionContent'
import WalletActionRequiredContent from './contents/WalletActionRequired'
import EvmLoginError from './contents/evm-linking/EvmLoginError'
import LinkEvmAddressContent from './contents/evm-linking/LinkEvmAddressContent'
import UnlinkEvmConfirmationContent from './contents/evm-linking/UnlinkEvmConfirmationContent'
import NotificationContent from './contents/notifications/NotificationContent'
import PushNotificationContent, {
  getPushNotificationUsableStatus,
} from './contents/notifications/PushNotificationContent'
import TelegramNotificationContent from './contents/notifications/TelegramNotificationContent'
import PolkadotConnectContent from './contents/polkadot-connect/PolkadotConnectContent'
import PolkadotConnectIdentityRemovedContent from './contents/polkadot-connect/PolkadotConnectIdentityRemovedContent'
import PolkadotConnectUnlink from './contents/polkadot-connect/PolkadotConnectUnlink'
import WithdrawContent from './contents/withdraw/WithdrawContent'
import { ProfileModalContentProps, ProfileModalState } from './types'

const modalContents: {
  [key in ProfileModalState]: (props: ProfileModalContentProps) => JSX.Element
} = {
  account: AccountContent,
  'linked-addresses': LinkedAddressesContent,
  'profile-settings': SimpleProfileSettingsContent,
  'privacy-security': PrivacySecurityContent,
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
  'polkadot-js-limited-support': LimitedPolkadotJsSupportContent,
  'polkadot-connect-account': PolkadotConnectAccountContent,
  'polkadot-connect-confirmation': PolkadotConnectConfirmationContent,
  'polkadot-connect-unlink': PolkadotConnectUnlink,
  'polkadot-connect-identity-removed': PolkadotConnectIdentityRemovedContent,
  'withdraw-tokens': WithdrawContent,
  'wallet-action-required': WalletActionRequiredContent,
  'loading-tx': () => (
    <div className='py-8'>
      <DynamicLoadedHamsterLoading />
    </div>
  ),
  'create-chat': CreateChatContent,
  'create-chat-loading': CreateChatLoadingContent,
}

const pushNotificationDesc: Record<
  ReturnType<typeof getPushNotificationUsableStatus>,
  string
> = {
  'need-install':
    'Push notifications are not available in your browser. Please install Grill to activate notifications.',
  unsupported: 'Push notifications are not available in your browser.',
  usable:
    'Push notifications allow you to receive direct updates from Grill in your browser.',
}

export const forceBackFlowStorage = new SessionStorage(
  () => 'force-back-profile-flow'
)

type ProfileModalProps = { disableOutsideClickClose?: boolean } & Pick<
  ModalProps,
  'withoutOverlay' | 'withoutShadow'
>

export default function ProfileModal({
  disableOutsideClickClose,
  ...props
}: ProfileModalProps) {
  const queryClient = useQueryClient()
  const { isOpen, defaultOpenState, closeModal, onBackClick } =
    useProfileModal()

  const hasProxyAddress = useMyAccount((state) => !!state.parentProxyAddress)
  const address = useMyMainAddress() ?? ''
  // Prefetch telegram linked account data
  getLinkedTelegramAccountsQuery.useQuery(
    { address },
    {
      enabled: isOpen,
    }
  )
  const { data: profile } = getProfileQuery.useQuery(address)

  useRedirectToNewChatPage(profile?.profileSpace?.id, closeModal)

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
      title: hasProxyAddress
        ? '🤔 Are you sure you want to logout?'
        : '🤔 Did you back up your Grill key?',
      withBackButton: true,
    },
    'privacy-security': {
      title: '🔑 Privacy & Security',
      withBackButton: true,
    },
    'private-key': {
      title: '🔑 My Grill key',
      withBackButton: 'privacy-security',
    },
    'share-session': {
      title: '💻 Share my session',
      desc: 'Use this link or scan the QR code to quickly log in to this account on another device.',
      withBackButton: 'privacy-security',
    },
    about: {
      title: 'About app',
      desc: null,
      withBackButton: true,
    },
    'link-evm-address': {
      title: linkedEvmAddress ? '🔑 My EVM address' : '🔑 Connect EVM',
      desc: 'Create an on-chain proof to link your Grill account, allowing you to use and display NFTs, and interact with ERC20s and smart contracts. ',
      withBackButton: 'account',
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
      desc: 'Receive Grill notifications in various locations',
      withBackButton: true,
      withoutDefaultPadding: true,
    },
    'telegram-notifications': {
      title: '🔔 Telegram bot',
      desc: 'Connect your account to our Telegram bot to receive notifications from Grill.',
      withBackButton: () => {
        getLinkedTelegramAccountsQuery.invalidate(queryClient)
        return 'notifications'
      },
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
        : 'Choose a wallet to connect to Grill',
      withBackButton: () => {
        if (!hasProxy) setPreferredWallet(null)
        return 'linked-addresses'
      },
      withoutDefaultPadding: true,
    },
    'polkadot-js-limited-support': {
      title: '🔗 Limited Polkadot.js Support',
      desc: (
        <LimitedPolkadotJsSupportExplanation
          goToWalletSelection={() => setCurrentState('polkadot-connect')}
        />
      ),
      withBackButton: 'polkadot-connect',
    },
    'polkadot-connect-account': {
      title: '🔗 Select an account',
      desc: 'Select an account to connect to Grill',
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
    'polkadot-connect-unlink': {
      title: '🤔 Unlink Polkadot address?',
      desc: undefined,
      withBackButton: false,
    },
    'polkadot-connect-identity-removed': {
      title: '😕 Your previous identity was removed',
      desc: 'You will need to reset your nickname or reconnect your EVM address to continue using them.',
      withBackButton: false,
    },
    'withdraw-tokens': {
      title: '💰 Withdraw',
      withBackButton: true,
    },
    'wallet-action-required': {
      title: '🔐 Wallet Action Required',
      desc: 'Please open your wallet to continue',
      withBackButton: false,
    },
    'loading-tx': {
      title: 'Transfer',
      desc: 'It may take up to 30 seconds',
      withBackButton: false,
    },
    'create-chat': {
      title: '💬 New Group Chat',
      withBackButton: true,
    },
    'create-chat-loading': {
      title: 'Creating chat',
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
    if (disableOutsideClickClose) return
    if (currentState === 'evm-address-linked' && (ensNames?.length ?? 0) > 0) {
      setCurrentStateAugmented('evm-set-profile-suggestion')
    } else closeModal()
  }
  const Content = modalContents[currentState]

  return (
    <Modal
      {...props}
      isOpen={isOpen}
      closeModal={augmentedCloseModal}
      title={title}
      description={desc}
      contentClassName={cx(withoutDefaultPadding && '!px-0 !pb-0')}
      titleClassName={cx(withoutDefaultPadding && 'px-6')}
      descriptionClassName={cx(withoutDefaultPadding && 'px-6')}
      withFooter={withFooter}
      withCloseButton={!disableOutsideClickClose}
      onBackClick={withBackButton ? usedOnBackClick : undefined}
    >
      <Content
        address={address}
        setCurrentState={setCurrentStateAugmented}
        evmAddress={linkedEvmAddress}
        closeModal={augmentedCloseModal}
      />
    </Modal>
  )
}
