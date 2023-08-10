import Button from '@/components/Button'
import { useLinkFcm } from '@/services/api/notifications/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { LocalStorage } from '@/utils/storage'
import { ContentProps } from '../types'
import { FCM_PUSH_NOTIFICATION_STORAGE_KEY } from './notifications/PushNotificationContent'

const fcmTokenStorage = new LocalStorage(
  () => FCM_PUSH_NOTIFICATION_STORAGE_KEY
)

function LogoutContent({ setCurrentState }: ContentProps) {
  const { address } = useMyAccount()
  const logout = useMyAccount((state) => state.logout)
  const sendEvent = useSendEvent()

  const { mutate: linkFcm, isLoading } = useLinkFcm({
    onSuccess: () => fcmTokenStorage.remove(),
  })

  const onShowPrivateKeyClick = () => {
    sendEvent('click no_show_me_my_private_key_button')
    setCurrentState('private-key')
  }
  const onLogoutClick = () => {
    sendEvent('click yes_log_out_button')
    logout()

    const fcmToken = fcmTokenStorage.get()

    if (fcmToken && address) {
      linkFcm({ address, fcmToken, action: 'unlink' })
    }
  }

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Button size='lg' onClick={onShowPrivateKeyClick}>
        No, show me my Grill secret key
      </Button>
      <Button
        isLoading={isLoading}
        size='lg'
        onClick={onLogoutClick}
        variant='primaryOutline'
      >
        Yes, log out
      </Button>
    </div>
  )
}

export default LogoutContent
