import { ApiResponse } from '@/server/common'
import axios from 'axios'

export const canUsePromoExtensionAccounts = [
  '3tFT2KDqmyfBU7hoGTNSJ8j2aBXQvvSQS5ncBdgtMM6SBQBS',
  '3rJPTPXHEq6sXeXK4CCgSnWhmakfpG4DknH62P616Zyr9XLz',
  '3q5o5HibyHXYrwVMinjcL4j95SDVNmLE46pu9Z5C8RTiWzwh',
  '3tATRYq6yiws8B8WhLxEuNPFtpLFh8xxe2K2Lnt8NTrjXk8N',
]

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

  const data = res.data as ApiResponse<any>
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

  const data = res.data as ApiResponse<any>
  if (!data.success) throw new Error(data.errors)

  return data.data
}
