import { ApiResponse, handlerWrapper } from '@/server/common'
import { ModerationCallInput } from '@/server/datahub-queue/generated'
import {
  addPostIdToOrg,
  blockResource,
  initModerationOrg,
  unblockResource,
} from '@/server/datahub-queue/moderation'
import { datahubMutationWrapper } from '@/server/datahub-queue/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return POST_handler(req, res)
  }

  return res.status(405).send('Method Not Allowed')
}

export type ApiDatahubModerationBody = ModerationCallInput
export type ApiDatahubModerationResponse = ApiResponse
const POST_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  errorLabel: 'moderation-action',
  handler: async (data: ApiDatahubModerationBody, _req, res) => {
    const mapper = datahubMutationWrapper(datahubModerationActionMapping)
    await mapper(data)

    res.json({
      message: 'OK',
      success: true,
    })
  },
})

async function datahubModerationActionMapping(data: ModerationCallInput) {
  const callName = data.callData?.name
  if (callName === 'synth_moderation_block_resource') {
    await blockResource(data)
  } else if (callName === 'synth_moderation_unblock_resource') {
    await unblockResource(data)
  } else if (callName === 'synth_moderation_init_moderator') {
    await initModerationOrg(data)
  } else if (callName === 'synth_moderation_add_ctx_to_organization') {
    await addPostIdToOrg(data)
  } else {
    throw Error('Unknown moderation action')
  }
}
