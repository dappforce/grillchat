import { IdentityProvider } from '@/old/services/datahub/generated-query'
import { getLinkedIdentityQuery } from '@/old/services/datahub/identity/query'
import { useMyAccount } from '@/stores/my-account'

export function useCanUseGrillKey() {
  const parentProxyAddress = useMyAccount.use.parentProxyAddress()
  const grillAddress = useMyAccount.use.address()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    grillAddress ?? ''
  )
  const isNotUsingPolkadotOrAlreadyLinkedPolkadot =
    !parentProxyAddress ||
    linkedIdentity?.provider === IdentityProvider.Polkadot

  return isNotUsingPolkadotOrAlreadyLinkedPolkadot
}
