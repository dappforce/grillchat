import { getReferrerIdQuery } from '@/services/datahub/referral/query'
import { queryClient } from '@/services/provider'
import { getReferralIdInUrl } from './ReferralUrlChanger'

export async function getReferralIdFromDbOrUrl(address: string) {
  return (
    (await getReferrerIdQuery.fetchQuery(queryClient, address)) ||
    getReferralIdInUrl()
  )
}

export async function sendEventWithRef(
  address: string,
  callback: (refId: string) => void
) {
  const refId = await getReferralIdFromDbOrUrl(address)
  callback(refId)
}
