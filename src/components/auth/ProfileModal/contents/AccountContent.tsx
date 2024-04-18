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
import NewCommunityModal from '@/components/community/NewCommunityModal'
import { SUGGEST_FEATURE_LINK } from '@/constants/links'
import useGetTheme from '@/hooks/useGetTheme'
import useIsInIframe from '@/hooks/useIsInIframe'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { getPostQuery, getProfileQuery } from '@/services/api/query'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import { currentNetwork } from '@/utils/network'
import {
  getIsAnIframeInSameOrigin,
  sendMessageToParentWindow,
} from '@/utils/window'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'ethers'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { FaRegBell, FaRegUser } from 'react-icons/fa'
import { LuRefreshCcw } from 'react-icons/lu'
import { useDisconnect } from 'wagmi'
import { useCanUseGrillKey } from '../hooks'
import { ProfileModalContentProps } from '../types'
import { useIsPushNotificationEnabled } from './notifications/PushNotificationContent'

export default function AccountContent({
  address,
  setCurrentState,
}: ProfileModalContentProps) {
  const canUseGrillKey = useCanUseGrillKey()
  const isInIframe = useIsInIframe()
  const { closeModal } = useProfileModal()
  const router = useRouter()

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

  const chatId = (
    profile?.profileSpace?.content?.experimental?.chats?.[0] as any
  )?.id

  const { data: chat } = getPostQuery.useQuery(chatId || '')

  const haveChat = !!chatId && chat?.struct.spaceId

  const colorModeOptions = useColorModeOptions()

  const {
    count: activatedNotificationCount,
    maxCount: maxNotificationCount,
    isLoading: isLoadingActivatedNotificationCount,
  } = useActivatedNotificationCount()

  const onPrivacySecurityKeyClick = () => {
    sendEvent('open_privacy_security_modal', commonEventProps)
    setCurrentState('privacy-security')
  }

  const onLogoutClick = () => {
    disconnect()
    sendEvent('open_log_out_modal', commonEventProps)
    setCurrentState('logout')
  }

  const menus: MenuListProps['menus'] = [
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
    ...(haveChat
      ? [
          {
            text: 'Creator Chat',
            icon: FaRegUser,
            onClick: (e: any) => {
              closeModal()

              const createChatLink = `/${profile?.profileSpace?.id}/${chatId}`
              if (getIsAnIframeInSameOrigin()) {
                e.preventDefault()
                sendMessageToParentWindow(
                  'redirect-hard',
                  `/c${createChatLink}`
                )
              } else {
                router.push(createChatLink)
              }
            },
          },
        ]
      : [
          {
            text: 'Create Chat',
            icon: FaRegUser,
            onClick: () => {
              setCurrentState('create-chat')
            },
          },
        ]),
    ...(canUseGrillKey
      ? [
          {
            text: 'My Key & Session',
            icon: KeyIcon,
            onClick: () => {
              onPrivacySecurityKeyClick()
            },
          },
        ]
      : []),
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
        <NewCommunityModal hubId={profile?.profileSpace?.id} />
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
