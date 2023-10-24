import Button from '@/components/Button'
import { ContentProps } from '../../types'

export default function PolkadotConnectIdentityRemovedContent({
  setCurrentState,
}: ContentProps) {
  return (
    <Button onClick={() => setCurrentState('profile-settings')} size='lg'>
      Go to account settings
    </Button>
  )
}
