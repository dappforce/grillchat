import { ApiResponse, handlerWrapper } from '@/server/common'
import { claimDailyReward } from '@/server/datahub-queue/content-staking'
import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return POST_handler(req, res)
  }
}

export type ApiDatahubContentStakingMutationBody = SocialEventDataApiInput

export type ApiDatahubContentStakingResponse = ApiResponse
const POST_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})<ApiDatahubContentStakingResponse>({
  allowedMethods: ['POST'],
  errorLabel: 'content-staking',
  handler: async (data: ApiDatahubContentStakingMutationBody, _, res) => {
    await claimDailyReward(data)
    res.status(200).json({ message: 'OK', success: true })
  },
})
