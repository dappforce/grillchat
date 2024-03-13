import { getReferralIdFromDbOrUrl } from '@/components/referral/ReferralUrlChanger'
import { queryClient } from '@/services/provider'

export async function sendEventWithRef(
  address: string,
  callback: (refId: string) => void
) {
  const refId = await getReferralIdFromDbOrUrl(queryClient, address)
  callback(refId)
}
