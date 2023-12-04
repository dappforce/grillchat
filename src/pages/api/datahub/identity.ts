import { ApiResponse, handlerWrapper } from '@/server/common'
import { linkIdentity } from '@/server/datahub-queue/identity'
import { datahubMutationWrapper } from '@/server/datahub-queue/utils'
import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return POST_handler(req, res)
  }

  return res.status(405).send('Method Not Allowed')
}

export type ApiDatahubIdentityBody = SocialEventDataApiInput
export type ApiDatahubModerationResponse = ApiResponse
const POST_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  errorLabel: 'moderation-action',
  handler: async (data: ApiDatahubIdentityBody, _req, res) => {
    const mapper = datahubMutationWrapper(datahubIdentityActionMapping)
    await mapper(data)

    res.json({
      message: 'OK',
      success: true,
    })
  },
})

async function datahubIdentityActionMapping(data: SocialEventDataApiInput) {
  const callName = data.callData?.name
  if (callName === 'synth_create_linked_identity') {
    await linkIdentity(data)
  } else {
    throw Error('Unknown identity action')
  }
}
