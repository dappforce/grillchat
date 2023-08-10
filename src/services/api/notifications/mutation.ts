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
import axios, { AxiosResponse } from 'axios'
import { sortObj } from 'jsonabc'
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

async function getFcmLinkingMessage(data: ApiFcmNotificationsLinkMessageBody) {
  if (!data) return null

  const res = await axios.post('/api/notifications/link-fcm', data)
  const encodedMessage = (res.data as ApiFcmNotificationsLinkMessageResponse)
    .data
  const decodedMessage = decodeURIComponent(encodedMessage)

  const parsedMessage = JSON.parse(decodedMessage)
  const sortedPayload = sortObj(parsedMessage.payload)

  return {
    messageData: parsedMessage,
    payloadToSign: JSON.stringify(sortedPayload),
  }
}
export const useGetFcmLinkingMessage = mutationWrapper(getFcmLinkingMessage)

async function commitSignedMessageWithAction(data: ApiCommitSignedMessageBody) {
  if (!data) return null

  const res = await axios.post('/api/notifications/commit', data)
  const resData = res.data as ApiCommitSignedMessageResponse
  return resData
}
export const useCommitSignedMessageWithAction = mutationWrapper(
  commitSignedMessageWithAction
)
