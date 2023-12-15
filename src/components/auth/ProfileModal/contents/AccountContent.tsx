import BellIcon from '@/assets/icons/bell.svg'
import ExitIcon from '@/assets/icons/exit.svg'
import InfoIcon from '@/assets/icons/info.svg'
import KeyIcon from '@/assets/icons/key.svg'
import LinkedAddressesIcon from '@/assets/icons/linked-addresses.svg'
import MoonIcon from '@/assets/icons/moon.svg'
import ShareIcon from '@/assets/icons/share.svg'
import SuggestFeatureIcon from '@/assets/icons/suggest-feature.svg'
import SunIcon from '@/assets/icons/sun.svg'
import DotBlinkingNotification from '@/components/DotBlinkingNotification'
import MenuList, { MenuListProps } from '@/components/MenuList'
import Notice from '@/components/Notice'
import ProfilePreview from '@/components/ProfilePreview'
import { SUGGEST_FEATURE_LINK } from '@/constants/links'
import useFirstVisitNotification from '@/hooks/useFirstVisitNotification'
import useGetTheme from '@/hooks/useGetTheme'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { installApp, isInstallAvailable } from '@/utils/install'
import { useTheme } from 'next-themes'
import { FiDownload } from 'react-icons/fi'
import { useDisconnect } from 'wagmi'
import { ProfileModalContentProps } from '../types'
import { useIsPushNotificationEnabled } from './notifications/PushNotificationContent'

export default function AccountContent({
  address,
  setCurrentState,
  notification,
}: ProfileModalContentProps) {
  const { showNotification, closeNotification } =
    useFirstVisitNotification('notification-menu')

  const sendEvent = useSendEvent()
  const commonEventProps = { eventSource: 'profile_menu' }
  const { disconnect } = useDisconnect()

  const colorModeOptions = useColorModeOptions()

  const { count: linkedAddressesCount, maxCount: maxLinkedCount } =
    useLinkedAccountCount()
  const { count: activatedNotificationCount, maxCount: maxNotificationCount } =
    useActivatedNotificationCount()

  const onLinkedAddressesClick = () => {
    sendEvent('open_linked_addresses', commonEventProps)
    setCurrentState('linked-addresses')
  }
  const onShowPrivateKeyClick = () => {
    sendEvent('open_show_private_key_modal', commonEventProps)
    setCurrentState('private-key')
  }
  const onShareSessionClick = () => {
    sendEvent('open_share_session_modal', commonEventProps)
    setCurrentState('share-session')
  }
  const onLogoutClick = () => {
    disconnect()
    sendEvent('open_log_out_modal', commonEventProps)
    setCurrentState('logout')
  }
  const onAboutClick = () => {
    sendEvent('open_about_app_info', commonEventProps)
    setCurrentState('about')
  }

  const menus: MenuListProps['menus'] = [
    {
      text: (
        <span className='flex items-center gap-2'>
          <span>Notifications</span>
          {!!activatedNotificationCount && (
            <Notice size='sm' noticeType='grey'>
              {activatedNotificationCount}/{maxNotificationCount} connected
            </Notice>
          )}
          {showNotification && <DotBlinkingNotification />}
        </span>
      ),
      icon: BellIcon,
      onClick: () => {
        closeNotification()
        setCurrentState('notifications')
      },
    },
    {
      text: (
        <span className='flex items-center gap-2'>
          <span>Linked Addresses</span>
          {!!linkedAddressesCount && (
            <Notice size='sm' noticeType='grey'>
              {linkedAddressesCount}/{maxLinkedCount} connected
            </Notice>
          )}
        </span>
      ),
      icon: LinkedAddressesIcon,
      onClick: onLinkedAddressesClick,
    },
    ...colorModeOptions,
    ...(isInstallAvailable()
      ? [
          {
            text: 'Install app',
            icon: FiDownload,
            onClick: installApp,
            iconClassName: 'text-text-muted text-xl',
          },
        ]
      : []),
    {
      text: (
        <span className='flex items-center gap-2'>
          <span>Show Grill key</span>
          {/* {notification?.showNotif && <DotBlinkingNotification />} */}
        </span>
      ),
      icon: KeyIcon,
      onClick: () => {
        notification?.setNotifDone()
        onShowPrivateKeyClick()
      },
    },
    { text: 'Share session', icon: ShareIcon, onClick: onShareSessionClick },
    {
      text: 'Suggest feature',
      icon: SuggestFeatureIcon,
      href: SUGGEST_FEATURE_LINK,
    },
    {
      text: 'About app',
      icon: InfoIcon,
      onClick: onAboutClick,
    },
    { text: 'Log out', icon: ExitIcon, onClick: onLogoutClick },
  ]

  return (
    <>
      <div className='mt-2 flex flex-col'>
        <div className='flex flex-col gap-4 border-b border-background-lightest px-6 pb-6'>
          <ProfilePreview
            onEditClick={() => setCurrentState('profile-settings')}
            address={address}
          />
        </div>
        <MenuList menus={menus} />
      </div>
    </>
  )
}

function useColorModeOptions(): MenuListProps['menus'] {
  const { setTheme } = useTheme()
  const theme = useGetTheme()
  const { theme: configTheme } = useConfigContext()

  if (configTheme) return []

  const lightModeOption: MenuListProps['menus'][number] = {
    text: 'Light mode',
    onClick: () => setTheme('light'),
    icon: SunIcon,
    iconClassName: cx('text-text-muted'),
  }
  const darkModeOption: MenuListProps['menus'][number] = {
    text: 'Dark Mode',
    onClick: () => setTheme('dark'),
    icon: MoonIcon,
    iconClassName: cx('text-text-muted'),
  }

  if (theme === 'light') return [darkModeOption]
  if (theme === 'dark') return [lightModeOption]

  return []
}

function useLinkedAccountCount() {
  const myAddress = useMyMainAddress()
  const hasProxy = useMyAccount((state) => !!state.parentProxyAddress)
  const { data: accountData } = getAccountDataQuery.useQuery(myAddress ?? '')

  let count = 0
  if (hasProxy) count++
  if (accountData?.evmAddress) count++

  return { count, maxCount: 2 }
}

function useActivatedNotificationCount() {
  const myAddress = useMyMainAddress()
  const { data: linkedAccounts } = getLinkedTelegramAccountsQuery.useQuery({
    address: myAddress ?? '',
  })
  const isTelegramLinked = !!linkedAccounts?.length
  const isPushNotificationEnabled = useIsPushNotificationEnabled()

  let count = 0
  if (isTelegramLinked) count++
  if (isPushNotificationEnabled) count++

  return { count, maxCount: 2 }
}
