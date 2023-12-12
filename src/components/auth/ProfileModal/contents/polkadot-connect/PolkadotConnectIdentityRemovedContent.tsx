import Button from '@/components/Button'
import { useSendEvent } from '@/stores/analytics'
import { ContentProps } from '../../types'

export default function PolkadotConnectIdentityRemovedContent({
  setCurrentState,
}: ContentProps) {
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
