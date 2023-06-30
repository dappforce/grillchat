import { getSubsocialPromoSecret } from '@/utils/env/server'
import { hexToU8a, u8aToString } from '@polkadot/util'
import { naclDecrypt } from '@polkadot/util-crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const secret = getSubsocialPromoSecret()

const querySchema = z.object({
  encryptedMessage: z.string(),
  nonce: z.number(),
})

export type ApiDecodeMessageResponse = {
  success: boolean
  message: string
  errors?: any
  data?: any
  hash?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiDecodeMessageResponse>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const { encryptedMessage, nonce } = req.body || {}
  const params = querySchema.safeParse({
    encryptedMessage: encryptedMessage ? encryptedMessage.toString() : '',
    nonce,
  })
  if (!params.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: params.error.errors,
    })
  }

  const { encryptedMessage: encodedMessageParam, nonce: nonceParam } =
    params.data

  const decodedMessage = await decryptMessage(encodedMessageParam, nonceParam)

  console.log(decodedMessage)

  return res
    .status(200)
    .send({ success: true, message: 'OK', data: decodedMessage })
}

async function decryptMessage(encodedMessage: string, nonce: number) {
  const newNonce = new Uint8Array(24)
  newNonce[0] = nonce

  console.log(encodedMessage, nonce)

  const decryptedMessage = naclDecrypt(
    hexToU8a(encodedMessage),
    newNonce,
    hexToU8a(secret)
  )

  console.log(decryptedMessage)

  return decryptedMessage ? u8aToString(decryptedMessage) : undefined
}
