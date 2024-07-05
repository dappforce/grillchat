import { ApiResponse, handlerWrapper } from '@/server/common'
import { claimTasksTokens } from '@/server/datahub-queue/claim-tasks-tokens'
import { datahubMutationWrapper } from '@/server/datahub-queue/utils'
import { ApiDatahubClaimTaskPointsBody } from '@/services/datahub/tasks/mutation'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export type ApiDatahubModerationResponse = ApiResponse
const POST_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  errorLabel: 'claim-task-tokens',
  handler: async (data, _req, res) => {
    const { payload } = data as ApiDatahubClaimTaskPointsBody

    const mapper = datahubMutationWrapper(claimTasksTokens)
    await mapper(payload)

    res.json({
      message: 'OK',
      success: true,
    })
  },
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return POST_handler(req, res)
  }

  return res.status(405).send('Method Not Allowed')
}
