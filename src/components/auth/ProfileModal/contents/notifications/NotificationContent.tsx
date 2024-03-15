import BellIcon from '@/assets/icons/bell.svg'
import Card from '@/components/Card'
import DotBlinkingNotification from '@/components/DotBlinkingNotification'
import MenuList from '@/components/MenuList'
import Notice from '@/components/Notice'
import useFirstVisitNotification from '@/hooks/useFirstVisitNotification'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { cx } from '@/utils/class-names'
import { HiOutlineMail } from 'react-icons/hi'
import { LiaDiscord, LiaTelegram } from 'react-icons/lia'
import { ProfileModalContentProps } from '../../types'
import { useIsPushNotificationEnabled } from './PushNotificationContent'

export default function NotificationContent({
  address,
  setCurrentState,
}: ProfileModalContentProps) {
  const pwa = useFirstVisitNotification('pwa-notification')
  const telegram = useFirstVisitNotification('telegram-notification')
  const { data: linkedAccounts } = getLinkedTelegramAccountsQuery.useQuery({
    address,
  })

  const isPushNotificationEnabled = useIsPushNotificationEnabled()

  return (
    <MenuList
      className='mb-2 pt-0'
      menus={[
        {
          text: (
            <span className='flex items-center gap-2'>
              <span>Telegram Bot</span>
              {!!linkedAccounts?.length ? (
                <Notice size='sm'>Enabled</Notice>
              ) : (
                telegram.showNotification && <DotBlinkingNotification />
              )}
            </span>
          ),
          iconClassName: cx('text-text-muted text-[20px]'),
          icon: LiaTelegram,
          onClick: () => {
            telegram.closeNotification()
            setCurrentState('telegram-notifications')
          },
        },
        {
          text: (
            <span className='flex items-center gap-2'>
              <span>Push Notifications</span>
              {isPushNotificationEnabled && <Notice size='sm'>Enabled</Notice>}
              {pwa.showNotification && <DotBlinkingNotification />}
            </span>
          ),
          iconClassName: cx('text-text-muted'),
          icon: BellIcon,
          onClick: () => {
            pwa.closeNotification()
            setCurrentState('push-notifications')
          },
        },
        {
          text: <SoonMenu text='Email Notifications' />,
          iconClassName: cx('text-text-muted text-[20px]'),
          icon: HiOutlineMail,
          disabled: true,
        },
        {
          text: <SoonMenu text='Discord notifications' />,
          iconClassName: cx('text-text-muted text-[20px]'),
          icon: LiaDiscord,
          disabled: true,
        },
      ]}
    />
  )
}

function SoonMenu({ text }: { text: string }) {
  return (
    <div className='flex w-full items-center gap-2'>
      <span>{text}</span>
      <Card size='sm'>Soon</Card>
    </div>
  )
}
