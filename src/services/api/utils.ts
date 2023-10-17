import { signMessage } from '@/utils/account'
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
  const signedPayload = await signMessage(parsedMessage.payloadToSign)
  parsedMessage.messageData['signature'] = signedPayload

  const signedMessage = encodeURIComponent(
    JSON.stringify(sortKeys(parsedMessage.messageData))
  )
  return signedMessage
}
