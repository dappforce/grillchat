import { IdentityProvider } from '@/services/datahub/generated-query'
import {
  getLinkedIdentityFromMainAddressQuery,
  getLinkedIdentityQuery,
} from '@/services/datahub/identity/query'
import { useMyGrillAddress } from '@/stores/my-account'

export default function useLinkedEvmAddress(
  address?: string,
  config = { enabled: true }
) {
  const myGrillAddress = useMyGrillAddress()

  const { data: myLinkedIdentity, isLoading: isLoadingMy } =
    getLinkedIdentityQuery.useQuery(myGrillAddress ?? '', {
      enabled: !address && config.enabled,
    })
  const { data: linkedIdentity, isLoading: isLoadingMainAddress } =
    getLinkedIdentityFromMainAddressQuery.useQuery(address ?? '', {
      enabled: !!address && config.enabled,
    })

  const usedLinkedIdentity = address ? linkedIdentity : myLinkedIdentity
  const usedLoading = address ? isLoadingMainAddress : isLoadingMy

  return {
    evmAddress: usedLinkedIdentity?.externalProviders.find(
      (identity) => identity.provider === IdentityProvider.Evm
    )?.externalId,
    isLoading: usedLoading,
  }
}
