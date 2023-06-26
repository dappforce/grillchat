import {
  ApiNotificationsLinkMessageBody,
  ApiNotificationsLinkMessageResponse,
} from '@/pages/api/notifications/link-message'
import mutationWrapper from '@/subsocial-query/base'
import axios from 'axios'

async function getLinkingMessage(data: ApiNotificationsLinkMessageBody) {
  if (!data) return null

  const res = await axios.post('/api/notifications/link-message', data)
  return (res.data as ApiNotificationsLinkMessageResponse).data
}
export const useGetLinkingMessage = mutationWrapper(getLinkingMessage)
