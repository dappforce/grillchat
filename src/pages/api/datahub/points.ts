import { ApiResponse, handlerWrapper } from '@/server/common'
import { savePointsAndEnergy } from '@/server/datahub-queue/energy-and-points'
import { datahubMutationWrapper } from '@/server/datahub-queue/utils'
import { ApiDatahubPointsAndEnergyBody } from '@/services/datahub/leaderboard/points-balance/mutation'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const inputSchema = z.object({
  id: z.string(),
  provider: z.string(),
  payload: z.any(),
})

export type ApiDatahubModerationResponse = ApiResponse
const POST_handler = handlerWrapper({
  inputSchema,
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  errorLabel: 'identity-action',
  handler: async (data, req, res) => {
    const { payload } = data as ApiDatahubPointsAndEnergyBody

    const mapper = datahubMutationWrapper(savePointsAndEnergy)
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
