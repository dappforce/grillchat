import { getProfileQuery } from '@/services/api/query'
import { getReferrerIdQuery } from '@/services/datahub/referral/query'
import { isClientGeneratedOptimisticId } from '@/services/subsocial/commentIds/optimistic'
import { useMyMainAddress } from '@/stores/my-account'
import {
  getCurrentSearchParams,
  getCurrentUrlWithoutQuery,
  getUrlQuery,
} from '@/utils/links'
import { QueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function getReferralIdInUrl() {
  return getUrlQuery('ref')
}

export async function getReferralIdFromDbOrUrl(
  client: QueryClient,
  address: string
) {
  return (
    (await getReferrerIdQuery.fetchQuery(client, address)) ||
    getReferralIdInUrl()
  )
}

export function useReferralId() {
  const myAddress = useMyMainAddress()
  const profile = getProfileQuery.useQuery(myAddress ?? '')
  const spaceId = profile.data?.profileSpace?.id
  if (isClientGeneratedOptimisticId(spaceId)) return undefined

  return spaceId || getReferralIdInUrl()
}

export function useReferralSearchParam() {
  const refId = useReferralId()
  if (!refId) return ''
  return `?ref=${refId}`
}

export function ReferralUrlChanger() {
  const referralId = useReferralId()
  const router = useRouter()

  useEffect(() => {
    if (!referralId) return
    const current = getCurrentSearchParams()
    current.set('ref', referralId)

    const newPath = `${getCurrentUrlWithoutQuery()}?${current.toString()}`
    router.replace(newPath, undefined, { shallow: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralId, router.pathname])

  return null
}
