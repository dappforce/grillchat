import {
  ApiNotificationsLinkUrlBody,
  ApiNotificationsLinkUrlResponse,
} from '@/pages/api/notifications/link'
import {
  ApiNotificationsLinkMessageBody,
  ApiNotificationsLinkMessageResponse,
} from '@/pages/api/notifications/link-message'
import { queryClient } from '@/services/provider'
import mutationWrapper from '@/subsocial-query/base'
import axios, { AxiosResponse } from 'axios'
import { processMessageTpl } from '../utils'
import { getLinkedTelegramAccountsQuery } from './query'

async function linkingAccount(data: ApiNotificationsLinkMessageBody) {
  if (!data) return null

  const res = await axios.post('/api/notifications/link-message', data)
  const encodedMessage = (res.data as ApiNotificationsLinkMessageResponse).data
  const signedMessage = await processMessageTpl(encodedMessage)

  const linkRes = await axios.post<
    any,
    AxiosResponse<ApiNotificationsLinkUrlResponse>,
    ApiNotificationsLinkUrlBody
  >('/api/notifications/link', {
    action: data.action,
    signedMessageWithDetails: signedMessage,
  })
  const resData = linkRes.data
  return resData.url
}
export const useLinkingAccount = mutationWrapper(linkingAccount, {
  onSuccess: (_, variables) => {
    if (variables.action === 'unlink') {
      getLinkedTelegramAccountsQuery.invalidate(queryClient, {
        address: variables.address,
      })
    }
  },
})
