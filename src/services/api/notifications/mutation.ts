import {
  ApiNotificationsLinkMessageBody,
  ApiNotificationsLinkMessageResponse,
} from '@/pages/api/notifications/link-message'
import {
  ApiNotificationsLinkUrlBody,
  ApiNotificationsLinkUrlResponse,
} from '@/pages/api/notifications/link-url'
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

async function createLinkingUrl(data: ApiNotificationsLinkUrlBody) {
  if (!data) return null

  const res = await axios.post('/api/notifications/link-url', data)
  const resData = res.data as ApiNotificationsLinkUrlResponse
  return resData.url
}
export const useCreateLinkingUrl = mutationWrapper(createLinkingUrl)
