import { enableWalletOnce, useMyAccount } from '@/stores/my-account'
import { Signer, signMessage } from '@/utils/account'
import type { Signer as InjectedSigner } from '@polkadot/api/types'
import { toSubsocialAddress } from '@subsocial/utils'
import sortKeys from 'sort-keys-recursive'

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

  const {
    preferredWallet,
    parentProxyAddress,
    connectWallet,
    connectedWallet,
  } = useMyAccount.getState()
  let signedPayload
  if (!parentProxyAddress) {
    signedPayload = await signMessage(parsedMessage.payloadToSign)
  } else {
    let currentAccountSigner: InjectedSigner | undefined

    if (connectedWallet?.address !== parentProxyAddress) {
      const accounts = await enableWalletOnce()
      const foundAcc = accounts.find(
        ({ address }) => toSubsocialAddress(address)! === parentProxyAddress
      )
      if (!foundAcc)
        throw new Error(
          `Cannot find your account in your ${preferredWallet} wallet. If you use another wallet, please unlink and link your wallet again`
        )

      connectWallet(foundAcc.address, foundAcc.signer as Signer)
      currentAccountSigner = foundAcc.signer as InjectedSigner
    } else {
      currentAccountSigner = connectedWallet.signer as InjectedSigner
    }

    const payload: { signature: string } | undefined =
      await currentAccountSigner.signRaw?.({
        address: parentProxyAddress,
        data: parsedMessage.payloadToSign,
        type: 'bytes',
      })

    if (!payload) throw new Error('Failed to sign message')
    signedPayload = payload.signature
  }

  parsedMessage.messageData['signature'] = signedPayload

  const signedMessage = encodeURIComponent(
    JSON.stringify(sortKeys(parsedMessage.messageData))
  )
  return signedMessage
}
