import { createQuery } from '@/old/subsocial-query'
import {
  ApiNotificationsLinkedTelegramParam,
  ApiNotificationsLinkedTelegramResponse,
} from '@/pages/api/notifications/linked-telegram'
import { apiInstance } from '../utils'

async function getLinkedTelegramAccounts(
  param: ApiNotificationsLinkedTelegramParam
) {
  if (!param.address) return null

  const res = await apiInstance.get('/api/notifications/linked-telegram', {
    params: param,
  })
  const responseData = res.data as ApiNotificationsLinkedTelegramResponse
  return responseData.accounts
}
export const getLinkedTelegramAccountsQuery = createQuery({
  key: 'getLinkedTelegramAccounts',
  fetcher: getLinkedTelegramAccounts,
  defaultConfigGenerator: (data) => ({
    enabled: !!data?.address,
  }),
})
