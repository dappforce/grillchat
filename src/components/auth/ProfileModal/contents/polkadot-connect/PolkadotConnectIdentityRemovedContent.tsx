import Button from '@/components/Button'
import { useSendEvent } from '@/stores/analytics'
import { ProfileModalContentProps } from '../../types'

export default function PolkadotConnectIdentityRemovedContent({
  setCurrentState,
}: ProfileModalContentProps) {
  const sendEvent = useSendEvent()
  return (
    <Button
      onClick={() => {
        setCurrentState('profile-settings')
        sendEvent('account_settings_opened', { eventSource: 'connect_modal' })
      }}
      size='lg'
    >
      Go to account settings
    </Button>
  )
}
