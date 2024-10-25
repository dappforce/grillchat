import { env } from '@/env.mjs'
import { signMessage } from '@/utils/account'
import axios from 'axios'
import sortKeys from 'sort-keys-recursive'

export const apiInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_BASE_PATH,
})

function parseMessageTpl(messageTpl: string) {
  const decodedMessage = decodeURIComponent(messageTpl)

  const parsedMessage = JSON.parse(decodedMessage) as any
  const sortedPayload = sortKeys(parsedMessage.payload)
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
    JSON.stringify(sortKeys(parsedMessage.messageData))
  )
  return signedMessage
}
