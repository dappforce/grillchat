import BellIcon from '@/assets/icons/bell.svg'
import MailIcon from '@/assets/icons/mail.svg'
import DotBlinkingNotification from '@/components/DotBlinkingNotification'
import MenuList from '@/components/MenuList'
import useFirstVisitNotification from '@/hooks/useFirstVisitNotification'
import { cx } from '@/utils/class-names'
import { FaDiscord, FaTelegram } from 'react-icons/fa'
import { ContentProps } from '../../types'

export default function NotificationContent({ setCurrentState }: ContentProps) {
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
          onClick: () => undefined,
        },
        {
          text: <SoonMenu text='Email Notifications' />,
          iconClassName: cx('text-[#A3ACBE]'),
          icon: MailIcon,
          onClick: () => undefined,
        },
        {
          text: <SoonMenu text='Discord notifications' />,
          iconClassName: cx('text-[#A3ACBE]'),
          icon: FaDiscord,
          onClick: () => undefined,
        },
      ]}
    />
  )
}

function SoonMenu({ text }: { text: string }) {
  return (
    <div className='flex w-full items-center justify-between text-text-muted'>
      <span>{text}</span>
      <span className='text-xs'>Soon</span>
    </div>
  )
}
