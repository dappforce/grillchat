import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
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
  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  const myAddress = useMyMainAddress()
  return isInitializedProxy ? myAddress || getReferralIdInUrl() : undefined
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
    if (current.get('ref') === referralId) return

    current.set('ref', referralId)
    const newPath = `${getCurrentUrlWithoutQuery()}?${current.toString()}`
    router.replace(newPath, undefined, { shallow: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralId, router.pathname])

  return null
}
