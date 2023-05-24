import mutationWrapper from '@/subsocial-query/base'
import { subsocialOffchainApi } from './common'

type SubscribeWithEmailBody = {
  email: string
  hubId: string
  chatId: string
}

export async function subscribeWithEmail({
  chatId,
  email,
  hubId,
}: SubscribeWithEmailBody) {
  const res = await subsocialOffchainApi.post('/mail/add_email/807277', {
    email,
    spaceId: hubId,
    channelId: chatId,
  })
  return res.data
}
export const useSubscribeWithEmail = mutationWrapper(subscribeWithEmail)
