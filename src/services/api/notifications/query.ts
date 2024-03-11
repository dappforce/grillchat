import { ApiNotificationsLinkedTelegramParam } from '@/pages/api/notifications/linked-telegram'
import { createQuery } from '@/subsocial-query'

async function getLinkedTelegramAccounts(
  param: ApiNotificationsLinkedTelegramParam
) {
  return [] as { userName: string }[]
  // if (!param.address) return null

  // const res = await apiInstance.get('/api/notifications/linked-telegram', {
  //   params: param,
  // })
  // const responseData = res.data as ApiNotificationsLinkedTelegramResponse
  // return responseData.accounts
}
export const getLinkedTelegramAccountsQuery = createQuery({
  key: 'getLinkedTelegramAccounts',
  fetcher: getLinkedTelegramAccounts,
  defaultConfigGenerator: (data) => ({
    // enabled: !!data?.address,
    // Temporary disable linked telegram because the integration for mainnet is not there yet
    enabled: false,
  }),
})
