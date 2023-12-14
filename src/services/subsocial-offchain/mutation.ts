import mutationWrapper from '@/subsocial-query/base'
import { subsocialOffchainApi } from './common'

type SubscribeWithEmailBody = {
  address: string
  email: string
}

export async function subscribeWithEmail({
  address,
  email,
}: SubscribeWithEmailBody) {
  const res = await subsocialOffchainApi.post('/mail/add_email/830087', {
    email,
    address,
  })
  return res.data
}
export const useSubscribeWithEmail = mutationWrapper(subscribeWithEmail)
