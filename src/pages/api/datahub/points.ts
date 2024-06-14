import { ApiResponse, handlerWrapper } from '@/server/common'
import { savePointsAndEnergy } from '@/server/datahub-queue/energy-and-points'
import { datahubMutationWrapper } from '@/server/datahub-queue/utils'
import { ApiDatahubPointsAndEnergyBody } from '@/services/datahub/leaderboard/points-balance/mutation'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export type ApiDatahubModerationResponse = ApiResponse
const POST_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  errorLabel: 'points-and-energy',
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
