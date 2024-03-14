import Button from '@/components/Button'
import { useLinkFcm } from '@/services/api/notifications/mutation'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { ProfileModalContentProps } from '../types'
import { fcmPushNotificationStorage } from './notifications/PushNotificationContent'

function LogoutContent({ setCurrentState }: ProfileModalContentProps) {
  const closeModal = useProfileModal((state) => state.closeModal)

  const parentProxyAddress = useMyAccount.use.parentProxyAddress()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    parentProxyAddress ?? ''
  )
  const isNotUsingPolkadotOrAlreadyLinkedPolkadot =
    !parentProxyAddress ||
    linkedIdentity?.provider === IdentityProvider.Polkadot

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
      linkFcm({ address, fcmToken, action: 'unlink' })
    }
    logout()
    closeModal()
  }

  return (
    <div className='mt-4 flex flex-col gap-4'>
      {isNotUsingPolkadotOrAlreadyLinkedPolkadot ? (
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
