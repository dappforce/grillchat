import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'

export default function useCanUnlinkAddress() {
  const address = useMyMainAddress()

  const hasProxy = useMyAccount((state) => !!state.parentProxyAddress)

  const { data: accountData } = getAccountDataQuery.useQuery(address ?? '')
  const hasEvmAddress = !!accountData?.evmAddress

  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    address ?? ''
  )
  const hasLinkedIdentity = !!linkedIdentity

  const identityLinkedCount = [
    hasProxy,
    hasEvmAddress,
    hasLinkedIdentity,
  ].filter(Boolean).length

  return identityLinkedCount > 1
}
