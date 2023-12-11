import Button from '@/components/Button'
import { getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { ContentProps } from '../../types'

export default function PolkadotConnectIdentityRemovedContent({
  setCurrentState,
}: ContentProps) {
  // You will need to reset your nickname or reconnect your EVM address to continue using them.
  const hasPreviousIdentity = useHasPreviousGrillIdentity()
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

export function useHasPreviousGrillIdentity() {
  const grillAddress = useMyAccount((state) => state.address)
  const { data: grillAccountData } = getAccountDataQuery.useQuery(
    grillAddress ?? ''
  )
  const { data: grillProfile } = getProfileQuery.useQuery(grillAddress ?? '')
  const hasPreviousIdentity =
    grillAccountData?.evmAddress || grillProfile?.profileSpace?.content?.name
  return !!hasPreviousIdentity
}
