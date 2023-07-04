import { ApiResponse } from '@/server/common'
import { getSubsocialPromoSecret } from '@/utils/env/server'
import { hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util'
import { naclEncrypt } from '@polkadot/util-crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const secret = getSubsocialPromoSecret()

const querySchema = z.object({
  message: z.string(),
  address: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const { message, address } = req.body || {}
  const params = querySchema.safeParse({
    message: message ? message.toString() : '',
    address: address ? address.toString() : '',
  })
  if (!params.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: params.error.errors,
    })
  }

  const { message: messsageParam, address: addressParam } = params.data

  const nonce = await getNonce(addressParam)

  const newNonce = new Uint8Array(24)

  newNonce[0] = nonce

  const encyptedMessage = await encryptMessage(messsageParam, newNonce)

  return res
    .status(200)
    .send({ success: true, message: 'OK', data: { encyptedMessage, nonce } })
}

async function getNonce(address: string) {
  const { getSubsocialApi } = await import(
    '@/subsocial-query/subsocial/connection'
  )
  const subsocialApi = await getSubsocialApi()
  const substrateApi = await subsocialApi.substrateApi
  const nonce = await substrateApi.rpc.system.accountNextIndex(address)

  return nonce.toNumber()
}

async function encryptMessage(message: string, nonce: Uint8Array) {
  const encryptedMessage = naclEncrypt(
    stringToU8a(message),
    hexToU8a(secret),
    nonce
  )
  return encryptedMessage.encrypted
    ? u8aToHex(encryptedMessage.encrypted)
    : undefined
}
