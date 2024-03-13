import { getReferrerIdQuery } from '@/services/datahub/referral/query'
import { queryClient } from '@/services/provider'
import { getReferralIdInUrl } from './ReferralUrlChanger'

export async function getReferralIdFromDbOrUrl(address: string) {
  try {
    const refId = await getReferrerIdQuery.fetchQuery(queryClient, address)
    return refId || getReferralIdInUrl()
  } catch {
    return getReferralIdInUrl()
  }
}

export async function sendEventWithRef(
  address: string,
  callback: (refId: string) => void
) {
  const refId = await getReferralIdFromDbOrUrl(address)
  callback(refId)
}
