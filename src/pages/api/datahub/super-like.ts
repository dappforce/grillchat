import { ApiResponse, handlerWrapper } from '@/server/common'
import {
  createSuperLike,
  getSuperLikeConfirmationMsg,
} from '@/server/datahub-queue/super-like'
import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return POST_handler(req, res)
  } else {
    return GET_handler(req, res)
  }
}

type GetResponseRes = { data: string }
export type ApiDatahubSuperLikeGetResponse = ApiResponse<GetResponseRes>

const GET_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.query,
})<GetResponseRes>({
  allowedMethods: ['GET'],
  errorLabel: 'datahub-query',
  handler: async (_, __, res) => {
    const message = await getSuperLikeConfirmationMsg()
    res.json({ data: message.message, message: 'OK', success: true })
  },
})

export type ApiDatahubSuperLikeMutationBody = {
  payload: SocialEventDataApiInput
}

export type ApiDatahubSuperLikeResponse = ApiResponse
const POST_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})<ApiDatahubSuperLikeResponse>({
  allowedMethods: ['POST'],
  errorLabel: 'super-like',
  handler: async (data: ApiDatahubSuperLikeMutationBody, _, res) => {
    await createSuperLike(data.payload)
    res.status(200).json({ message: 'OK', success: true })
  },
})
