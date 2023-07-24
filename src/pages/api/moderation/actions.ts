import { ApiResponse, handlerWrapper } from '@/server/common'
import { commitAction, initModerationOrgMessage } from '@/server/moderation'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return GET_handler(req, res)
  }

  if (req.method === 'POST') {
    return POST_handler(req, res)
  }

  return res.status(405).send('Method Not Allowed')
}

const querySchema = z.object({
  action: z.literal('init'),
  address: z.string(),
  postId: z.string(),
})
export type ApiModerationActionsMessageParams = z.infer<typeof querySchema>
type ResponseDataMessage = {
  messageTpl?: string
}
export type ApiModerationActionsMessageResponse =
  ApiResponse<ResponseDataMessage>

const GET_handler = handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req) => req.query,
})<ResponseDataMessage>({
  allowedMethods: ['GET'],
  handler: async (data, _req, res) => {
    if (data.action === 'init') {
      const messageTpl = await initModerationOrgMessage({
        address: data.address,
        postId: data.postId,
      })
      res.json({ messageTpl, success: true, message: 'OK' })
      return
    }
    res.json({ message: 'Not Implemented', success: false })
  },
})

const bodySchema = z.object({
  signedMessage: z.string(),
})
export type ApiModerationActionsBody = z.infer<typeof bodySchema>
export type ApiModerationActionsResponse = ApiResponse
const POST_handler = handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  handler: async (data, _req, res) => {
    const response = await commitAction({ signedMessage: data.signedMessage })
    res.json({
      message: response?.message ?? 'Failed to commit moderation action',
      success: response?.success ?? false,
    })
  },
})
