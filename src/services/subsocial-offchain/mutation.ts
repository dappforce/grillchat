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

export async function subscribeInLanding({ email }: { email: string }) {
  const res = await subsocialOffchainApi.post('/mail/add_email/518168', {
    email,
  })
  return res.data
}
export const useSubscribeInLanding = mutationWrapper(subscribeInLanding)

export async function subscribeViaLoginGoogle({
  email,
  address,
}: {
  email: string
  address: string
}) {
  const res = await subsocialOffchainApi.post('/mail/add_email/839924', {
    email,
    address,
  })
  return res.data
}
export const useSubscribeViaLoginGoogle = mutationWrapper(
  subscribeViaLoginGoogle
)
