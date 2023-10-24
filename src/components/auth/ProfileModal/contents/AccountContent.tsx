import BellIcon from '@/assets/icons/bell.svg'
import EthIcon from '@/assets/icons/eth.svg'
import ExitIcon from '@/assets/icons/exit.svg'
import InfoIcon from '@/assets/icons/info.svg'
import KeyIcon from '@/assets/icons/key.svg'
import MoonIcon from '@/assets/icons/moon.svg'
import ShareIcon from '@/assets/icons/share.svg'
import SuggestFeatureIcon from '@/assets/icons/suggest-feature.svg'
import SunIcon from '@/assets/icons/sun.svg'
import Button from '@/components/Button'
import DotBlinkingNotification from '@/components/DotBlinkingNotification'
import MenuList, { MenuListProps } from '@/components/MenuList'
import ProfilePreview from '@/components/ProfilePreview'
import { SUGGEST_FEATURE_LINK } from '@/constants/links'
import useFirstVisitNotification from '@/hooks/useFirstVisitNotification'
import useGetTheme from '@/hooks/useGetTheme'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { installApp, isInstallAvailable } from '@/utils/install'
import { useTheme } from 'next-themes'
import { FiDownload } from 'react-icons/fi'
import { useDisconnect } from 'wagmi'
import { ContentProps } from '../types'

export default function AccountContent({
  address,
  setCurrentState,
  notification,
  evmAddress,
}: ContentProps) {
  const { showNotification, closeNotification } =
    useFirstVisitNotification('notification-menu')

  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const ensName = accountData?.ensName

  const sendEvent = useSendEvent()
  const commonEventProps = { eventSource: 'profile_menu' }
  const { disconnect } = useDisconnect()

  const colorModeOptions = useColorModeOptions()

  const onLinkEvmAddressClick = () => {
    sendEvent('start_link_evm_address', commonEventProps)
    setCurrentState('link-evm-address')
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
      text: evmAddress ? 'My EVM Address' : 'Link EVM address',
      icon: EthIcon,
      onClick: () => {
        notification?.setNotifDone()
        onLinkEvmAddressClick()
      },
    },
    {
      text: (
        <span className='flex items-center gap-2'>
          <span>Show Grill secret key</span>
          {notification?.showNotif && <DotBlinkingNotification />}
        </span>
      ),
      icon: KeyIcon,
      onClick: () => {
        notification?.setNotifDone()
        onShowPrivateKeyClick()
      },
    },
    { text: 'Share session', icon: ShareIcon, onClick: onShareSessionClick },
    ...colorModeOptions,
    {
      text: 'Suggest feature',
      icon: SuggestFeatureIcon,
      href: SUGGEST_FEATURE_LINK,
    },
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
          <ProfilePreview address={address} />
          {!ensName && (
            <Button
              variant='primaryOutline'
              onClick={() => setCurrentState('subsocial-profile')}
            >
              Change my name
            </Button>
          )}
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
