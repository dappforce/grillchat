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
import { useMyAccount } from '@/stores/my-account'
import mutationWrapper from '@/subsocial-query/base'
import { AxiosResponse } from 'axios'
import { apiInstance, processMessageTpl } from '../utils'
import { getLinkedTelegramAccountsQuery } from './query'

async function linkTelegramAccount(
  data: Omit<ApiNotificationsLinkMessageBody, 'address' | 'parentProxyAddress'>
) {
  if (!data) return null

  const { address, parentProxyAddress } = useMyAccount.getState()
  if (!address) throw new Error('You need to login first')

  const res = await apiInstance.post<
    any,
    AxiosResponse<ApiNotificationsLinkMessageResponse>,
    ApiNotificationsLinkMessageBody
  >('/api/notifications/link-message', {
    action: data.action,
    address,
    parentProxyAddress,
  })
  const encodedMessage = res.data.data
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
      const { address, parentProxyAddress } = useMyAccount.getState()
      const mainAddress = parentProxyAddress || address
      if (!mainAddress) return

      getLinkedTelegramAccountsQuery.invalidate(queryClient, {
        address: mainAddress,
      })
    }
  },
})

async function linkFcm(
  data: Omit<
    ApiFcmNotificationsLinkMessageBody,
    'address' | 'parentProxyAddress'
  >
) {
  if (!data) return null

  const { parentProxyAddress, address } = useMyAccount.getState()
  if (!address) throw new Error('You need to login first')

  const res = await apiInstance.post<
    any,
    AxiosResponse<ApiFcmNotificationsLinkMessageResponse>,
    ApiFcmNotificationsLinkMessageBody
  >('/api/notifications/link-fcm', {
    ...data,
    parentProxyAddress,
    address,
  })
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
