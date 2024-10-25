import { env } from '@/env.mjs'
import { getBlockedResourcesQuery } from '@/old/services/datahub/moderation/query'
import { useMyMainAddress } from '@/stores/my-account'
import { useMemo } from 'react'

export function useIsAddressBlockedInApp(address?: string) {
  const myAddress = useMyMainAddress()
  const usedAddress = address || myAddress || ''
  const { data, isLoading } = getBlockedResourcesQuery.useQuery({
    appId: env.NEXT_PUBLIC_APP_ID,
  })

  const isBlocked = useMemo(() => {
    return data?.blockedResources.address.includes(usedAddress)
  }, [data, usedAddress])

  return { isLoading, isBlocked }
}
