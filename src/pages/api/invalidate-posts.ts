import { postsCache } from '@/modules/_api/cache'
import { ApiResponse } from '@/modules/_api/types'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const bodySchema = z.object({
  postIds: z.array(z.string()),
})

export type InvalidatePostsResponse = ApiResponse

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InvalidatePostsResponse>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const body = bodySchema.safeParse(req.body)
  if (!body.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: body.error.errors,
    })
  }

  postsCache.invalidateIds(body.data.postIds)
  res.status(200).send({ success: true, message: 'OK' })
}
