import { ApiResponse, handlerWrapper } from '@/server/common'
import {
  blockResourceMessage,
  commitAction,
  initModerationOrgMessage,
  unblockResourceMessage,
} from '@/server/moderation'
import { toSubsocialAddress } from '@subsocial/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { getPostsServer } from '../posts'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return GET_handler(req, res)
  }

  if (req.method === 'POST') {
    return POST_handler(req, res)
  }

  return res.status(405).send('Method Not Allowed')
}

const querySchema = z
  .object({
    action: z.literal('init'),
    address: z.string(),
    postId: z.string(),
    spaceId: z.string(),
  })
  .or(
    z.object({
      action: z.literal('block'),
      address: z.string(),
      ctxPostId: z.string(),
      ctxSpaceId: z.string(),
      resourceId: z.string(),
      reasonId: z.string(),
    })
  )
  .or(
    z.object({
      action: z.literal('unblock'),
      address: z.string(),
      ctxPostId: z.string(),
      ctxSpaceId: z.string(),
      resourceId: z.string(),
    })
  )
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
  errorLabel: 'moderation-action-message',
  handler: async (data, _req, res) => {
    if (data.action === 'init') {
      const [post] = await getPostsServer([data.postId])
      const isNotOwner =
        toSubsocialAddress(post.struct.ownerId) !==
        toSubsocialAddress(data.address)
      if (isNotOwner) {
        res.json({ success: false, message: 'Not the owner of the post' })
        return
      }

      const messageTpl = await initModerationOrgMessage({
        address: data.address,
        postId: data.postId,
        spaceId: data.spaceId,
      })
      res.json({ messageTpl, success: true, message: 'OK' })
    } else if (data.action === 'block') {
      const { action, ...otherParams } = data
      const messageTpl = await blockResourceMessage(otherParams)
      res.json({ messageTpl, success: true, message: 'OK' })
    } else if (data.action === 'unblock') {
      const { action, ...otherParams } = data
      const messageTpl = await unblockResourceMessage(otherParams)
      res.json({ messageTpl, success: true, message: 'OK' })
    } else {
      res.json({ message: 'Not Implemented', success: false })
    }
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
  errorLabel: 'moderation-action',
  handler: async (data, _req, res) => {
    const response = await commitAction({ signedMessage: data.signedMessage })
    res.json({
      message: response?.success ? 'OK' : response?.message ?? 'Error',
      success: response?.success ?? true,
    })
  },
})
