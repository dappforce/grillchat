import ExitIcon from '@/assets/icons/exit.svg'
import MoonIcon from '@/assets/icons/moon.svg'
import SunIcon from '@/assets/icons/sun.svg'
import MenuList, { MenuListProps } from '@/components/MenuList'
import ProfilePreview from '@/components/ProfilePreview'
import NewCommunityModal from '@/components/community/NewCommunityModal'
import useGetTheme from '@/hooks/useGetTheme'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useTheme } from 'next-themes'
import { FaUserCog } from 'react-icons/fa'
import { TbDeviceMobilePlus } from 'react-icons/tb'
import { useDisconnect } from 'wagmi'
import { ProfileModalContentProps } from '../types'
import { useIsPushNotificationEnabled } from './notifications/PushNotificationContent'

export default function AccountContent({
  address,
  setCurrentState,
}: ProfileModalContentProps) {
  const sendEvent = useSendEvent()
  const commonEventProps = { eventSource: 'profile_menu' }
  const { disconnect } = useDisconnect()

  const { data: profile } = getProfileQuery.useQuery(address)

  const colorModeOptions = useColorModeOptions()

  const onPrivacySecurityKeyClick = () => {
    sendEvent('open_privacy_security_modal', commonEventProps)
    setCurrentState('share-session')
  }

  const onLogoutClick = () => {
    disconnect()
    sendEvent('open_log_out_modal', commonEventProps)
    setCurrentState('logout')
  }

  const menus: MenuListProps['menus'] = [
    {
      text: 'Linked Accounts',
      icon: FaUserCog,
      onClick: () => {
        onPrivacySecurityKeyClick()
      },
    },
    {
      text: 'Share Session',
      icon: TbDeviceMobilePlus,
      onClick: () => {
        onPrivacySecurityKeyClick()
      },
    },
    ...colorModeOptions,
    { text: 'Log Out', icon: ExitIcon, onClick: onLogoutClick },
  ]

  return (
    <>
      <div className='mt-2 flex flex-col'>
        <div className='flex flex-col gap-6 border-b border-background-lightest px-6 pb-6'>
          <ProfilePreview
            onEditClick={() => setCurrentState('profile-settings')}
            address={address}
          />

          {/* <div
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
                  <LinkText variant={'primary'} onClick={() => undefined}>
                    Withdraw
                  </LinkText>
                )}
              </SkeletonFallback>
            </div>
          </div> */}
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
