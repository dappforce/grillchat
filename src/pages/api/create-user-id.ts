import { ApiResponse, handlerWrapper } from '@/server/common'
import { getUserIdSalt } from '@/utils/env/server'
import { createHash } from 'crypto'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const bodySchema = z.object({
  address: z.string(),
})

type ResponseData = {
  userId?: string
}
export type CreateUserIdResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<ResponseData>({
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    let userId: string
    try {
      const userIdInput = `${data.address}-${getUserIdSalt() ?? ''}`
      userId = createHash('sha256').update(userIdInput).digest('hex')
    } catch (e: any) {
      return res.status(500).send({
        message: '',
        success: false,
        errors: e.message,
      })
    }

    res.status(200).send({ success: true, message: 'OK', userId })
  },
})
