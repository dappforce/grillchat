import {
  ApiNotificationsLinkedTelegramParam,
  ApiNotificationsLinkedTelegramResponse,
} from '@/pages/api/notifications/linked-telegram'
import { createQuery } from '@/subsocial-query'
import axios from 'axios'

async function getLinkedTelegramAccounts(
  param: ApiNotificationsLinkedTelegramParam
) {
  if (!param.address) return null

  const res = await axios.get('/api/notifications/linked-telegram', {
    params: param,
  })
  const responseData = res.data as ApiNotificationsLinkedTelegramResponse
  return responseData.accounts
}
export const getLinkedTelegramAccountsQuery = createQuery({
  key: 'getLinkedTelegramAccounts',
  fetcher: getLinkedTelegramAccounts,
})
