import { ApiResponse, convertNonce, handlerWrapper } from '@/server/common'
import { getSubsocialPromoSecret } from '@/utils/env/server'
import { hexToU8a, u8aToString } from '@polkadot/util'
import { naclDecrypt } from '@polkadot/util-crypto'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const secret = getSubsocialPromoSecret()

const querySchema = z.object({
  encryptedMessage: z.string(),
  nonce: z.number(),
})

type ResponseData = {
  data?: string
}

export type DecryptRespose = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<ResponseData>({
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    let decryptedMessage

    try {
      const { encryptedMessage: encodedMessageParam, nonce: nonceParam } = data

      decryptedMessage = await decryptMessage(encodedMessageParam, nonceParam)
    } catch (e: any) {
      return res.status(500).send({
        message: '',
        success: false,
        errors: e.message,
      })
    }

    res
      .status(200)
      .send({ success: true, message: 'OK', data: decryptedMessage })
  },
})

async function decryptMessage(encodedMessage: string, nonce: number) {
  const convertedNonce = convertNonce(nonce)

  const decryptedMessage = naclDecrypt(
    hexToU8a(encodedMessage),
    convertedNonce,
    hexToU8a(secret)
  )

  return decryptedMessage ? u8aToString(decryptedMessage) : undefined
}
