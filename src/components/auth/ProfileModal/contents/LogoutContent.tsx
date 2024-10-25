import Button from '@/components/Button'
import { useLinkFcm } from '@/old/services/api/notifications/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { useCanUseGrillKey } from '../hooks'
import { ProfileModalContentProps } from '../types'
import { fcmPushNotificationStorage } from './notifications/PushNotificationContent'

function LogoutContent({ setCurrentState }: ProfileModalContentProps) {
  const closeModal = useProfileModal((state) => state.closeModal)

  const canUseGrillKey = useCanUseGrillKey()

  const address = useMyAccount((state) => state.address)
  const logout = useMyAccount((state) => state.logout)
  const sendEvent = useSendEvent()

  const { mutate: linkFcm, isLoading } = useLinkFcm()

  const onShowPrivateKeyClick = () => {
    setCurrentState('private-key')
  }
  const onLogoutClick = () => {
    sendEvent('account_logout')
    const fcmToken = fcmPushNotificationStorage.get(address ?? '')

    if (fcmToken && address) {
      fcmPushNotificationStorage.remove(address ?? '')
      linkFcm({ fcmToken, action: 'unlink' })
    }
    logout()
    closeModal()
  }

  return (
    <div className='mt-4 flex flex-col gap-4'>
      {canUseGrillKey ? (
        <Button size='lg' onClick={onShowPrivateKeyClick}>
          No, show me my Grill key
        </Button>
      ) : (
        <Button size='lg' onClick={() => setCurrentState('account')}>
          No, keep me logged in
        </Button>
      )}
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
