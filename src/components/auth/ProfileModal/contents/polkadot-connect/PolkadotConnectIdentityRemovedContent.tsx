import Button from '@/components/Button'
import { ContentProps } from '../../types'

export default function PolkadotConnectIdentityRemovedContent({
  setCurrentState,
}: ContentProps) {
  // TODO: SET TO ACCOUNT EDIT SETTINGS
  return (
    <Button onClick={() => setCurrentState('account')} size='lg'>
      Go to account settings
    </Button>
  )
}
