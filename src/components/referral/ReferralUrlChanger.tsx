import { getProfileQuery } from '@/services/api/query'
import { useMyMainAddress } from '@/stores/my-account'
import {
  getCurrentSearchParams,
  getCurrentUrlWithoutQuery,
} from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useReferralId() {
  const myAddress = useMyMainAddress()
  const profile = getProfileQuery.useQuery(myAddress ?? '')
  return profile.data?.profileSpace?.id
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
