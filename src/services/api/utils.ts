import { signMessage } from '@/utils/account'
import { sortObj } from 'jsonabc'

function parseMessageTpl(messageTpl: string) {
  const decodedMessage = decodeURIComponent(messageTpl)

  const parsedMessage = JSON.parse(decodedMessage)
  const sortedPayload = sortObj(parsedMessage.payload)
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
    JSON.stringify(sortObj(parsedMessage.messageData))
  )
  return signedMessage
}
