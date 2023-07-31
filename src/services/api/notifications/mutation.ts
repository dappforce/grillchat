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
import mutationWrapper from '@/subsocial-query/base'
import axios from 'axios'
import { sortObj } from 'jsonabc'

async function getLinkingMessage(data: ApiNotificationsLinkMessageBody) {
  if (!data) return null

  const res = await axios.post('/api/notifications/link-message', data)
  const encodedMessage = (res.data as ApiNotificationsLinkMessageResponse).data
  const decodedMessage = decodeURIComponent(encodedMessage)

  const parsedMessage = JSON.parse(decodedMessage)
  const sortedPayload = sortObj(parsedMessage.payload)

  return {
    messageData: parsedMessage,
    payloadToSign: JSON.stringify(sortedPayload),
  }
}
export const useGetLinkingMessage = mutationWrapper(getLinkingMessage)

async function linkingAccount(data: ApiNotificationsLinkUrlBody) {
  if (!data) return null

  const res = await axios.post('/api/notifications/link', data)
  const resData = res.data as ApiNotificationsLinkUrlResponse
  return resData.url
}
export const useLinkingAccount = mutationWrapper(linkingAccount)

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
