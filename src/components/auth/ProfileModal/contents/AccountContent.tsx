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
import LinkText from '@/components/LinkText'
import MenuList, { MenuListProps } from '@/components/MenuList'
import Notice from '@/components/Notice'
import ProfilePreview from '@/components/ProfilePreview'
import { SUGGEST_FEATURE_LINK } from '@/constants/links'
import useFirstVisitNotification from '@/hooks/useFirstVisitNotification'
import useGetTheme from '@/hooks/useGetTheme'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { buildBalancesKey } from '@/services/substrateBalances/utils'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { installApp, isInstallAvailable } from '@/utils/install'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { formatUnits } from 'ethers'
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
  const theme = useGetTheme()

  const { data: balance } = getBalancesQuery.useQuery(
    buildBalancesKey(address, 'subsocial')
  )
  const chainData = useGetChainDataByNetwork('subsocial')
  const { freeBalance } = balance?.balances['SUB'] || {}

  const { decimal, tokenSymbol } = chainData || {}

  const balanceValue =
    decimal && freeBalance ? formatUnits(freeBalance, decimal) : '0'

  const sendEvent = useSendEvent()
  const commonEventProps = { eventSource: 'profile_menu' }
  const { disconnect } = useDisconnect()

  const colorModeOptions = useColorModeOptions()

  const {
    count: linkedAddressesCount,
    maxCount: maxLinkedCount,
    isLoading: isLoadingLinkedAcccountCount,
  } = useLinkedAccountCount()
  const {
    count: activatedNotificationCount,
    maxCount: maxNotificationCount,
    isLoading: isLoadingActivatedNotificationCount,
  } = useActivatedNotificationCount()

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
          {!isLoadingActivatedNotificationCount && (
            <Notice size='sm' noticeType='grey'>
              {activatedNotificationCount} / {maxNotificationCount}
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
          {!isLoadingLinkedAcccountCount && (
            <Notice size='sm' noticeType='grey'>
              {linkedAddressesCount} / {maxLinkedCount}
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
          <span>Show Grill Key</span>
          {/* {notification?.showNotif && <DotBlinkingNotification />} */}
        </span>
      ),
      icon: KeyIcon,
      onClick: () => {
        notification?.setNotifDone()
        onShowPrivateKeyClick()
      },
    },
    { text: 'Share Session', icon: ShareIcon, onClick: onShareSessionClick },
    {
      text: 'Suggest Feature',
      icon: SuggestFeatureIcon,
      href: SUGGEST_FEATURE_LINK,
    },
    {
      text: 'About App',
      icon: InfoIcon,
      onClick: onAboutClick,
    },
    { text: 'Log Out', icon: ExitIcon, onClick: onLogoutClick },
  ]
  // e9eff4
  return (
    <>
      <div className='mt-2 flex flex-col'>
        <div className='flex flex-col gap-6 border-b border-background-lightest px-6 pb-6'>
          <ProfilePreview
            onEditClick={() => setCurrentState('profile-settings')}
            address={address}
          />
          {!new BigNumber(balanceValue).isZero() && (
            <div
              className={clsx(
                'flex items-center justify-between gap-4 rounded-2xl p-4',
                theme === 'dark' ? 'bg-[#2C384F]' : 'bg-[#e9eff4]'
              )}
            >
              <div className='flex items-center gap-2'>
                <div className='text-slate-400'>Balance:</div>
                <div>
                  {new BigNumber(balanceValue).toFixed(4)} {tokenSymbol}
                </div>
              </div>
              <div>
                <LinkText
                  variant={'primary'}
                  onClick={() => setCurrentState('withdraw-tokens')}
                >
                  Withdraw
                </LinkText>
              </div>
            </div>
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
    text: 'Light Mode',
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
  const { data: accountData, isLoading } = getAccountDataQuery.useQuery(
    myAddress ?? ''
  )

  let count = 0
  if (hasProxy) count++
  if (accountData?.evmAddress) count++

  return { count, maxCount: 2, isLoading }
}

function useActivatedNotificationCount() {
  const myAddress = useMyMainAddress()
  const { data: linkedAccounts, isLoading } =
    getLinkedTelegramAccountsQuery.useQuery({
      address: myAddress ?? '',
    })
  const isTelegramLinked = !!linkedAccounts?.length
  const isPushNotificationEnabled = useIsPushNotificationEnabled()

  let count = 0
  if (isTelegramLinked) count++
  if (isPushNotificationEnabled) count++

  return { count, maxCount: 2, isLoading }
}
