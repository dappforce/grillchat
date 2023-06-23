import BellIcon from '@/assets/icons/bell.svg'
import MailIcon from '@/assets/icons/mail.svg'
import DotBlinkingNotification from '@/components/DotBlinkingNotification'
import MenuList from '@/components/MenuList'
import { FaDiscord, FaTelegram } from 'react-icons/fa'
import { ContentProps } from '../types'

export default function NotificationContent({}: ContentProps) {
  return (
    <MenuList
      className='mb-2 pt-0'
      menus={[
        {
          text: (
            <span className='flex items-center gap-2'>
              <span>Telegram Bot</span>
              <DotBlinkingNotification />
            </span>
          ),
          icon: FaTelegram,
          onClick: () => undefined,
        },
        {
          text: <SoonMenu text='Push Notifications' />,
          icon: BellIcon,
          onClick: () => undefined,
        },
        {
          text: <SoonMenu text='Email Notifications' />,
          icon: MailIcon,
          onClick: () => undefined,
        },
        {
          text: <SoonMenu text='Discord notifications' />,
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
