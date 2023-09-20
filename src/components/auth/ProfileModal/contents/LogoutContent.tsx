import Button from '@/components/Button'
import { useLinkFcm } from '@/services/api/notifications/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { ContentProps } from '../types'
import { fcmPushNotificationStorage } from './notifications/PushNotificationContent'

function LogoutContent({ setCurrentState }: ContentProps) {
  const address = useMyAccount((state) => state.address)
  const logout = useMyAccount((state) => state.logout)
  const sendEvent = useSendEvent()

  const { mutate: linkFcm, isLoading } = useLinkFcm({
    onSuccess: () => fcmPushNotificationStorage.remove(address ?? ''),
  })

  const onShowPrivateKeyClick = () => {
    setCurrentState('private-key')
  }
  const onLogoutClick = () => {
    sendEvent('account_logout')
    const fcmToken = fcmPushNotificationStorage.get(address ?? '')

    logout()

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
