import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'

export default function useAddressRandomSeed(
  address: string,
  { enabled } = { enabled: true }
) {
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    address || '',
    { enabled }
  )
  const { data: accountData } = getAccountDataQuery.useQuery(address || '', {
    enabled,
  })
  const { evmAddress } = accountData || {}

  return evmAddress || linkedIdentity?.externalId || address
}
