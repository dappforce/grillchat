import { ApiDecodeMessageResponse } from '@/pages/api/promo-message/decrypt'
import { ApiEncodeMessageResponse } from '@/pages/api/promo-message/encrypt'
import axios from 'axios'

type EncryptedMessageData = {
  encyptedMessage?: string
  nonce: number
}

export async function encodeSecretBox(
  message: string,
  address: string
): Promise<EncryptedMessageData | undefined> {
  const res = await axios.post('/api/promo-message/encrypt', {
    message,
    address,
  })

  const data = res.data as ApiEncodeMessageResponse
  if (!data.success) throw new Error(data.errors)

  return data.data as EncryptedMessageData
}

export async function decodeSecretBox(
  encryptedMessage: string,
  nonce: number
): Promise<string | undefined> {
  const res = await axios.post('/api/promo-message/decrypt', {
    encryptedMessage,
    nonce,
  })

  const data = res.data as ApiDecodeMessageResponse
  if (!data.success) throw new Error(data.errors)

  return data.data
}
