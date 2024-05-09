import DynamicLoadedHamsterLoading from '@/components/DynamicLoadedHamsterLoading'
import useRedirectToNewChatPage from '@/components/community/useRedirectToNewChatPage'
import Modal, { ModalProps } from '@/components/modals/Modal'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { SessionStorage } from '@/utils/storage'
import { replaceUrl } from '@/utils/window'
import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useEffect, useState } from 'react'
import AboutContent from './contents/AboutContent'
import AccountContent from './contents/AccountContent'
import {
  CreateChatContent,
  CreateChatLoadingContent,
} from './contents/CreateChatContent'
import LinkedIdentitiesContent from './contents/LinkedIdentitiesContent'
import LogoutContent from './contents/LogoutContent'
import PrivacySecurityContent from './contents/PrivacySecurityContent'
import PrivateKeyContent from './contents/PrivateKeyContent'
import SimpleProfileSettingsContent from './contents/ProfileSettingsContent/SimpleProfileSettingsContent'
import ShareSessionContent from './contents/ShareSessionContent'
import WalletActionRequiredContent from './contents/WalletActionRequired'
import NotificationContent from './contents/notifications/NotificationContent'
import PushNotificationContent, {
  getPushNotificationUsableStatus,
} from './contents/notifications/PushNotificationContent'
import TelegramNotificationContent from './contents/notifications/TelegramNotificationContent'
import {
  ProfileModalContentProps,
  ProfileModalState,
  profileModalStates,
} from './types'

const modalContents: {
  [key in ProfileModalState]: (props: ProfileModalContentProps) => JSX.Element
} = {
  account: AccountContent,
  'profile-settings': SimpleProfileSettingsContent,
  'privacy-security': PrivacySecurityContent,
  'private-key': PrivateKeyContent,
  'linked-accounts': LinkedIdentitiesContent,
  logout: LogoutContent,
  'share-session': ShareSessionContent,
  about: AboutContent,
  notifications: NotificationContent,
  'telegram-notifications': TelegramNotificationContent,
  'push-notifications': PushNotificationContent,
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
  const { isOpen, defaultOpenState, closeModal, onBackClick, openModal } =
    useProfileModal()

  const hasProxyAddress = useMyAccount((state) => !!state.parentProxyAddress)
  const address = useMyMainAddress() ?? ''
  const { data: profile } = getProfileQuery.useQuery(address)

  useRedirectToNewChatPage(profile?.profileSpace?.id, closeModal)

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

  const sendEvent = useSendEvent()

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
    'linked-accounts': {
      title: '🔗 Linked Identities',
      withBackButton: true,
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
      withBackButton: true,
    },
    about: {
      title: 'About app',
      desc: null,
      withBackButton: true,
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
    const openProfileStep = getUrlQuery('profile')
    if (openProfileStep) {
      const isValidState = profileModalStates.includes(openProfileStep)
      if (isValidState) {
        openModal({ defaultOpenState: openProfileStep })
      } else {
        openModal()
      }
      replaceUrl(getCurrentUrlWithoutQuery('profile'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    closeModal()
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
        closeModal={augmentedCloseModal}
      />
    </Modal>
  )
}
