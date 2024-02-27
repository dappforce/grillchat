import { handlerWrapper } from '@/server/common'
import { SocialProfileAddReferrerIdInput } from '@/server/datahub-queue/generated'
import { setReferrerId } from '@/server/datahub-queue/referral'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return POST_handler(req, res)
  }

  return res.status(405).send('Method Not Allowed')
}

export type ApiDatahubReferralBody = SocialProfileAddReferrerIdInput
const POST_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  errorLabel: 'referral',
  handler: async (data, _, res) => {
    await setReferrerId(data)
    res.json({
      message: 'OK',
      success: true,
    })
  },
})
