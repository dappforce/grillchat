import BellIcon from '@/assets/icons/bell.svg'
import MailIcon from '@/assets/icons/mail.svg'
import Card from '@/components/Card'
import DotBlinkingNotification from '@/components/DotBlinkingNotification'
import MenuList from '@/components/MenuList'
import Notice from '@/components/Notice'
import useFirstVisitNotification from '@/hooks/useFirstVisitNotification'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { cx } from '@/utils/class-names'
import { FaDiscord, FaTelegram } from 'react-icons/fa'
import { ContentProps } from '../../types'

export default function NotificationContent({
  address,
  setCurrentState,
}: ContentProps) {
  const { data: linkedAccounts } = getLinkedTelegramAccountsQuery.useQuery({
    address,
  })
  const { showNotification, closeNotification } = useFirstVisitNotification(
    'telegram-notification'
  )

  return (
    <MenuList
      className='mb-2 pt-0'
      menus={[
        {
          text: (
            <span className='flex items-center gap-2'>
              <span>Telegram Bot</span>
              {!!linkedAccounts?.length && <Notice size='sm'>Enabled</Notice>}
              {showNotification && <DotBlinkingNotification />}
            </span>
          ),
          iconClassName: cx('text-[#A3ACBE]'),
          icon: FaTelegram,
          onClick: () => {
            closeNotification()
            setCurrentState('telegram-notifications')
          },
        },
        {
          text: <SoonMenu text='Push Notifications' />,
          iconClassName: cx('text-[#A3ACBE]'),
          icon: BellIcon,
          disabled: true,
        },
        {
          text: <SoonMenu text='Email Notifications' />,
          iconClassName: cx('text-[#A3ACBE]'),
          icon: MailIcon,
          disabled: true,
        },
        {
          text: <SoonMenu text='Discord notifications' />,
          iconClassName: cx('text-[#A3ACBE]'),
          icon: FaDiscord,
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
