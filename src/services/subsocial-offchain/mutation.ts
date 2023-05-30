import mutationWrapper from '@/subsocial-query/base'
import { subsocialOffchainApi } from './common'

type SubscribeWithEmailBody = {
  email: string
  chatId: string
}

export async function subscribeWithEmail({
  chatId,
  email,
}: SubscribeWithEmailBody) {
  const res = await subsocialOffchainApi.post('/mail/add_email/807277', {
    email,
    channelId: chatId,
  })
  return res.data
}
export const useSubscribeWithEmail = mutationWrapper(subscribeWithEmail)
