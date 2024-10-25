import { env } from '@/env.mjs'
import { ApiResponse, convertNonce, handlerWrapper } from '@/old/server/common'
import { hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util'
import { naclEncrypt } from '@polkadot/util-crypto'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const secret = env.SUBSOCIAL_PROMO_SECRET_HEX

const querySchema = z.object({
  message: z.string(),
  address: z.string(),
})

type ResponseData = {
  data?: {
    encyptedMessage?: `0x${string}`
    nonce: number
  }
}

export type EncryptRespose = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<ResponseData>({
  errorLabel: 'encrypt-promo-message',
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    let encyptedMessage
    let nonce = 0

    try {
      const { message: messsageParam, address: addressParam } = data

      nonce = await getNonce(addressParam)

      const convertedNonce = convertNonce(nonce)

      encyptedMessage = await encryptMessage(messsageParam, convertedNonce)
    } catch (e: any) {
      return res.status(500).send({
        message: '',
        success: false,
        errors: e.message,
      })
    }

    res
      .status(200)
      .send({ success: true, message: 'OK', data: { encyptedMessage, nonce } })
  },
})

async function getNonce(address: string) {
  const { getSubsocialApi } = await import(
    '@/old/subsocial-query/subsocial/connection'
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
