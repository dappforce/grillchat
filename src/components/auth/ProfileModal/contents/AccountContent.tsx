import ExitIcon from '@/assets/icons/exit.svg'
import KeyIcon from '@/assets/icons/key.svg'
import MoonIcon from '@/assets/icons/moon.svg'
import SuggestFeatureIcon from '@/assets/icons/suggest-feature.svg'
import SunIcon from '@/assets/icons/sun.svg'
import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import MenuList, { MenuListProps } from '@/components/MenuList'
import Notice from '@/components/Notice'
import ProfilePreview from '@/components/ProfilePreview'
import SkeletonFallback from '@/components/SkeletonFallback'
import { SUGGEST_FEATURE_LINK } from '@/constants/links'
import useGetTheme from '@/hooks/useGetTheme'
import useIsInIframe from '@/hooks/useIsInIframe'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { getProfileQuery } from '@/services/api/query'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { currentNetwork } from '@/utils/network'
import {
  getIsAnIframeInSameOrigin,
  sendMessageToParentWindow,
} from '@/utils/window'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'ethers'
import { useTheme } from 'next-themes'
import { FaRegBell, FaRegUser } from 'react-icons/fa'
import { LuRefreshCcw } from 'react-icons/lu'
import { useDisconnect } from 'wagmi'
import { ProfileModalContentProps } from '../types'
import { useIsPushNotificationEnabled } from './notifications/PushNotificationContent'

export default function AccountContent({
  address,
  setCurrentState,
}: ProfileModalContentProps) {
  // const { showNotification, closeNotification } =
  //   useFirstVisitNotification('notification-menu')

  const isInIframe = useIsInIframe()

  const {
    data: balance,
    isLoading,
    isRefetching,
    refetch,
  } = getBalancesQuery.useQuery({
    address,
    chainName: 'subsocial',
  })
  const chainData = useGetChainDataByNetwork('subsocial')
  const { freeBalance } = balance?.balances['SUB'] || {}

  const { decimal, tokenSymbol } = chainData || {}

  const balanceValue =
    decimal && freeBalance ? formatUnits(freeBalance, decimal) : '0'

  const sendEvent = useSendEvent()
  const commonEventProps = { eventSource: 'profile_menu' }
  const { disconnect } = useDisconnect()

  const { data: profile } = getProfileQuery.useQuery(address)

  const colorModeOptions = useColorModeOptions()

  // const {
  //   count: linkedAddressesCount,
  //   maxCount: maxLinkedCount,
  //   isLoading: isLoadingLinkedAcccountCount,
  // } = useLinkedAccountCount()
  const {
    count: activatedNotificationCount,
    maxCount: maxNotificationCount,
    isLoading: isLoadingActivatedNotificationCount,
  } = useActivatedNotificationCount()

  // const onLinkedAddressesClick = () => {
  //   sendEvent('open_linked_addresses', commonEventProps)
  //   setCurrentState('linked-addresses')
  // }
  const onShowPrivateKeyClick = () => {
    sendEvent('open_show_private_key_modal', commonEventProps)
    setCurrentState('private-key')
  }
  // const onShareSessionClick = () => {
  //   sendEvent('open_share_session_modal', commonEventProps)
  //   setCurrentState('share-session')
  // }
  const onLogoutClick = () => {
    disconnect()
    sendEvent('open_log_out_modal', commonEventProps)
    setCurrentState('logout')
  }
  // const onAboutClick = () => {
  //   sendEvent('open_about_app_info', commonEventProps)
  //   setCurrentState('about')
  // }

  const menus: MenuListProps['menus'] = [
    {
      text: (
        <span className='flex items-center gap-2'>
          <span>Notifications Settings</span>
          {!isLoadingActivatedNotificationCount && (
            <Notice size='sm' noticeType='grey'>
              {activatedNotificationCount} / {maxNotificationCount}
            </Notice>
          )}
        </span>
      ),
      icon: FaRegBell,
      onClick: () => {
        setCurrentState('notifications')
      },
    },
    // {
    //   text: (
    //     <span className='flex items-center gap-2'>
    //       <span>Linked Addresses</span>
    //       {!isLoadingLinkedAcccountCount && (
    //         <Notice size='sm' noticeType='grey'>
    //           {linkedAddressesCount} / {maxLinkedCount}
    //         </Notice>
    //       )}
    //     </span>
    //   ),
    //   icon: LinkedAddressesIcon,
    //   onClick: onLinkedAddressesClick,
    // },
    // ...(isInstallAvailable()
    //   ? [
    //       {
    //         text: 'Install app',
    //         icon: FiDownload,
    //         onClick: installApp,
    //         iconClassName: 'text-text-muted text-xl',
    //       },
    //     ]
    //   : []),
    ...(profile?.profileSpace?.id && currentNetwork === 'subsocial'
      ? [
          {
            text: 'My Profile',
            icon: FaRegUser,
            onClick: () => {
              const isInGrillSoPolkaverseSide = getIsAnIframeInSameOrigin()
              if (isInGrillSoPolkaverseSide) {
                sendMessageToParentWindow(
                  'redirect',
                  `/${profile?.profileSpace?.id}`
                )
              } else {
                window.location.href = `/${profile?.profileSpace?.id}`
              }
            },
          },
        ]
      : []),
    {
      text: 'Show Grill key',
      icon: KeyIcon,
      onClick: () => {
        onShowPrivateKeyClick()
      },
    },
    {
      text: 'Suggest Feature',
      icon: SuggestFeatureIcon,
      href: SUGGEST_FEATURE_LINK,
      onClick: (e) => {
        if (getIsAnIframeInSameOrigin()) {
          e.preventDefault()
          sendMessageToParentWindow('redirect-hard', SUGGEST_FEATURE_LINK)
        }
      },
    },
    // {
    //   text: 'About App',
    //   icon: InfoIcon,
    //   onClick: onAboutClick,
    // },
    ...(!isInIframe ? colorModeOptions : []),
    { text: 'Log Out', icon: ExitIcon, onClick: onLogoutClick },
  ]

  const balanceValueBN = new BigNumber(balanceValue)

  return (
    <>
      <div className='mt-2 flex flex-col'>
        <div className='flex flex-col gap-6 border-b border-background-lightest px-6 pb-6'>
          <ProfilePreview
            onEditClick={() => setCurrentState('profile-settings')}
            address={address}
          />

          <div
            className={
              'flex items-center justify-between gap-4 rounded-2xl bg-background-lighter p-4'
            }
          >
            <div className='flex items-center gap-2'>
              <div className='text-text-muted'>Balance:</div>
              <div>
                <SkeletonFallback
                  className='my-0 w-20 bg-background-lightest'
                  isLoading={isLoading || isRefetching}
                >
                  {balanceValueBN.toFixed(4)} {tokenSymbol}
                </SkeletonFallback>
              </div>
              <Button
                className='text-text-muted'
                size='noPadding'
                variant='transparent'
                onClick={() => refetch()}
              >
                <LuRefreshCcw />
              </Button>
            </div>
            <div>
              <SkeletonFallback
                isLoading={isLoading}
                className='my-0 w-20 bg-background-lightest'
              >
                {balanceValueBN.isZero() ? (
                  <LinkText
                    variant={'primary'}
                    href={
                      'https://docs.subsocial.network/docs/tutorials/GetSUB/get-sub'
                    }
                    target='_blank'
                  >
                    Get SUB
                  </LinkText>
                ) : (
                  <LinkText
                    variant={'primary'}
                    onClick={() => setCurrentState('withdraw-tokens')}
                  >
                    Withdraw
                  </LinkText>
                )}
              </SkeletonFallback>
            </div>
          </div>
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

// function useLinkedAccountCount() {
//   const myAddress = useMyMainAddress()
//   const hasProxy = useMyAccount((state) => !!state.parentProxyAddress)
//   const { data: accountData, isLoading } = getAccountDataQuery.useQuery(
//     myAddress ?? ''
//   )

//   let count = 0
//   if (hasProxy) count++
//   if (accountData?.evmAddress) count++

//   return { count, maxCount: 2, isLoading }
// }

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
