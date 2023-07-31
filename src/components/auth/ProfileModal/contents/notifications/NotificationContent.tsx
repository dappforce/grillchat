import BellIcon from '@/assets/icons/bell.svg'
import MailIcon from '@/assets/icons/mail.svg'
import DotBlinkingNotification from '@/components/DotBlinkingNotification'
import MenuList from '@/components/MenuList'
import useFirstVisitNotification from '@/hooks/useFirstVisitNotification'
import { getMessageToken } from '@/services/firebase/messaging'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { FaDiscord, FaTelegram } from 'react-icons/fa'
import { ContentProps } from '../../types'

export default function NotificationContent({ setCurrentState }: ContentProps) {
  const address = useMyAccount((state) => state.address)

  const pwa = useFirstVisitNotification('pwa-notification')
  const telegram = useFirstVisitNotification('telegram-notification')

  const enablePushNotification = async () => {
    const token = await getMessageToken()

    if (token) {
      // TODO: Send backend request to store mapping between token & address.
      console.log('fcm token', token, 'User Address: ', address)
    }
  }

  return (
    <MenuList
      className='mb-2 pt-0'
      menus={[
        {
          text: (
            <span className='flex items-center gap-2'>
              <span>Telegram Bot</span>
              {telegram.showNotification && <DotBlinkingNotification />}
            </span>
          ),
          iconClassName: cx('text-[#A3ACBE]'),
          icon: FaTelegram,
          onClick: () => {
            telegram.closeNotification()
            setCurrentState('telegram-notifications')
          },
        },
        {
          text: (
            <span className='flex items-center gap-2'>
              <span>Push Notifications</span>
              {pwa.showNotification && <DotBlinkingNotification />}
            </span>
          ),
          iconClassName: cx('text-[#A3ACBE]'),
          icon: BellIcon,
          onClick: () => {
            pwa.closeNotification()
            setCurrentState('push-notifications')
          },
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
    <div className='flex w-full items-center justify-between'>
      <span>{text}</span>
      <span className='text-xs'>Soon</span>
    </div>
  )
}
