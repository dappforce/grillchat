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

  const evmProviders = usedLinkedIdentity?.externalProviders.filter(
    (identity) => identity.provider === IdentityProvider.Evm
  )
  let latestEvmAddress = ''
  let latestEvmCreatedTime = 0
  evmProviders?.forEach((provider) => {
    const currentCreated = new Date(provider.createdAtTime).getTime()
    if (currentCreated > latestEvmCreatedTime) {
      latestEvmAddress = provider.externalId
      latestEvmCreatedTime = currentCreated
    }
  })

  return {
    evmAddress: latestEvmAddress,
    isLoading: usedLoading,
  }
}
