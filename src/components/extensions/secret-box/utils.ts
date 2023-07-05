import { DecryptRespose } from '@/pages/api/promo-message/decrypt'
import { EncryptRespose } from '@/pages/api/promo-message/encrypt'
import mutationWrapper from '@/subsocial-query/base'
import axios from 'axios'

export const canUsePromoExtensionAccounts = [
  '3tFT2KDqmyfBU7hoGTNSJ8j2aBXQvvSQS5ncBdgtMM6SBQBS',
  '3rJPTPXHEq6sXeXK4CCgSnWhmakfpG4DknH62P616Zyr9XLz',
  '3q5o5HibyHXYrwVMinjcL4j95SDVNmLE46pu9Z5C8RTiWzwh',
  '3tATRYq6yiws8B8WhLxEuNPFtpLFh8xxe2K2Lnt8NTrjXk8N',
]

type EncodeSecretBoxParams = {
  message: string
  address: string
}

async function encodeSecretBox({ message, address }: EncodeSecretBoxParams) {
  const res = await axios.post('/api/promo-message/encrypt', {
    message,
    address,
  })

  const data = res.data as EncryptRespose
  if (!data.success) throw new Error(data.errors)

  return data.data
}
export const useEncodeSecretBox = mutationWrapper(encodeSecretBox)

type DecodeSecretBoxParams = {
  encryptedMessage: string
  nonce: number
}

async function decodeSecretBox({
  encryptedMessage,
  nonce,
}: DecodeSecretBoxParams) {
  const res = await axios.post('/api/promo-message/decrypt', {
    encryptedMessage,
    nonce,
  })

  const data = res.data as DecryptRespose
  if (!data.success) throw new Error(data.errors)

  return data.data
}
export const useDecodeSecretBox = mutationWrapper(decodeSecretBox)
