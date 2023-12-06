import { ApiResponse, handlerWrapper } from '@/server/common'
import {
  ModerationCallInput,
  SocialCallName,
} from '@/server/datahub-queue/generated'
import {
  addPostIdToOrg,
  blockResource,
  initModerationOrg,
  unblockResource,
} from '@/server/datahub-queue/moderation'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return POST_handler(req, res)
  }

  return res.status(405).send('Method Not Allowed')
}

const actionsMapper: {
  [key in SocialCallName]?: (data: ModerationCallInput) => Promise<any>
} = {
  synth_moderation_block_resource: blockResource,
  synth_moderation_unblock_resource: unblockResource,
  synth_moderation_init_moderator: initModerationOrg,
  synth_moderation_add_ctx_to_organization: addPostIdToOrg,
}

export type ApiModerationActionsBody = ModerationCallInput
export type ApiModerationActionsResponse = ApiResponse
const POST_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  errorLabel: 'moderation-action',
  handler: async (data: ApiModerationActionsBody, _req, res) => {
    const callName = data.callData?.name
    const action = actionsMapper[callName as SocialCallName]
    if (!action) {
      throw Error('Unknown moderation action')
    }
    await action(data)

    res.json({
      message: 'OK',
      success: true,
    })
  },
})
