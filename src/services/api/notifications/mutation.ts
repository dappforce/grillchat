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
import { signMessage, useMyAccount } from '@/stores/my-account'
import mutationWrapper from '@/subsocial-query/base'
import { AxiosResponse } from 'axios'
import sortKeysRecursive from 'sort-keys-recursive'
import { apiInstance } from '../utils'
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

      if (queryClient) {
        getLinkedTelegramAccountsQuery.invalidate(queryClient, {
          address: mainAddress,
        })
      }
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

function parseMessageTpl(messageTpl: string) {
  const decodedMessage = decodeURIComponent(messageTpl)

  const parsedMessage = JSON.parse(decodedMessage) as any
  const sortedPayload = sortKeysRecursive(parsedMessage.payload)
  return {
    payloadToSign: JSON.stringify(sortedPayload),
    messageData: parsedMessage,
  }
}

export async function processMessageTpl(encodedMessage: string) {
  const parsedMessage = parseMessageTpl(encodedMessage)

  const signedPayload = await signMessage(parsedMessage.payloadToSign)
  // if (!parentProxyAddress) {
  //   signedPayload = await signMessage(parsedMessage.payloadToSign)
  // } else {
  //   let currentAccountSigner: InjectedSigner | undefined

  //   if (connectedWallet?.address !== parentProxyAddress) {
  //     const accounts = await enableWalletOnce()
  //     const foundAcc = accounts.find(
  //       ({ address }) => toSubsocialAddress(address)! === parentProxyAddress
  //     )
  //     if (!foundAcc)
  //       throw new Error(
  //         `Cannot find your account in your ${preferredWallet} wallet. If you use another wallet, please unlink and link your wallet again`
  //       )

  //     connectWallet(foundAcc.address, foundAcc.signer as Signer)
  //     currentAccountSigner = foundAcc.signer as InjectedSigner
  //   } else {
  //     currentAccountSigner = connectedWallet.signer as InjectedSigner
  //   }

  //   const payload: { signature: string } | undefined =
  //     await currentAccountSigner.signRaw?.({
  //       address: parentProxyAddress,
  //       data: parsedMessage.payloadToSign,
  //       type: 'bytes',
  //     })

  //   if (!payload) throw new Error('Failed to sign message')
  //   signedPayload = payload.signature
  // }

  parsedMessage.messageData['signature'] = signedPayload

  const signedMessage = encodeURIComponent(
    JSON.stringify(sortKeysRecursive(parsedMessage.messageData))
  )
  return signedMessage
}
