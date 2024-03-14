import { IdentityProvider } from '@/services/datahub/generated-query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useMyAccount } from '@/stores/my-account'

export function useCanUseGrillKey() {
  const parentProxyAddress = useMyAccount.use.parentProxyAddress()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    parentProxyAddress ?? ''
  )
  const isNotUsingPolkadotOrAlreadyLinkedPolkadot =
    !parentProxyAddress ||
    linkedIdentity?.provider === IdentityProvider.Polkadot

  return isNotUsingPolkadotOrAlreadyLinkedPolkadot
}
