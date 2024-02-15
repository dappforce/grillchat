import {
  ApiCommitSignedMessageBody,
  ApiCommitSignedMessageResponse,
} from '@/pages/api/notifications/commit'
import {
  ApiNotificationsLinkUrlBody,
  ApiNotificationsLinkUrlResponse,
} from '@/pages/api/notifications/link'
import {
  ApiFcmNotificationsLinkMessageBody,
  ApiFcmNotificationsLinkMessageResponse,
} from '@/pages/api/notifications/link-fcm'
import {
  ApiNotificationsLinkMessageBody,
  ApiNotificationsLinkMessageResponse,
} from '@/pages/api/notifications/link-message'
import { queryClient } from '@/services/provider'
import mutationWrapper from '@/subsocial-query/base'
import { AxiosResponse } from 'axios'
import { apiInstance, processMessageTpl } from '../utils'
import { getLinkedTelegramAccountsQuery } from './query'

async function linkTelegramAccount(data: ApiNotificationsLinkMessageBody) {
  if (!data) return null

  const res = await apiInstance.post('/api/notifications/link-message', data)
  const encodedMessage = (res.data as ApiNotificationsLinkMessageResponse).data
  const signedMessage = await processMessageTpl(encodedMessage)

  const linkRes = await apiInstance.post<
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
export const useLinkTelegramAccount = mutationWrapper(linkTelegramAccount, {
  onSuccess: (_, variables) => {
    if (variables.action === 'unlink') {
      getLinkedTelegramAccountsQuery.invalidate(queryClient, {
        address: variables.address,
      })
    }
  },
})

async function linkFcm(data: ApiFcmNotificationsLinkMessageBody) {
  if (!data) return null

  const res = await apiInstance.post('/api/notifications/link-fcm', data)
  const encodedMessage = (res.data as ApiFcmNotificationsLinkMessageResponse)
    .data
  const signedMessage = await processMessageTpl(encodedMessage)

  const linkRes = await apiInstance.post<
    any,
    AxiosResponse<ApiCommitSignedMessageResponse>,
    ApiCommitSignedMessageBody
  >('/api/notifications/commit', { signedMessageWithDetails: signedMessage })
  const resData = linkRes.data
  return resData.message
}
export const useLinkFcm = mutationWrapper(linkFcm)
