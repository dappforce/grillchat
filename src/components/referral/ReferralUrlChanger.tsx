import { getProfileQuery } from '@/services/api/query'
import { isClientGeneratedOptimisticId } from '@/services/subsocial/commentIds/optimistic'
import { useMyMainAddress } from '@/stores/my-account'
import {
  getCurrentSearchParams,
  getCurrentUrlWithoutQuery,
  getUrlQuery,
} from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function getReferralIdInUrl() {
  return getUrlQuery('ref')
}

export function useReferralId() {
  const myAddress = useMyMainAddress()
  const profile = getProfileQuery.useQuery(myAddress ?? '')
  const spaceId = profile.data?.profileSpace?.id
  if (isClientGeneratedOptimisticId(spaceId)) return undefined

  return spaceId
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

    const newPath = `${getCurrentUrlWithoutQuery()}?${current.toString()}`
    router.replace(newPath, undefined, { shallow: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralId, router.pathname])

  return null
}
