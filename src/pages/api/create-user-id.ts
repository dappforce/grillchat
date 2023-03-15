import { getUserIdSalt } from '@/utils/env/server'
import { createHash } from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const bodySchema = z.object({
  address: z.string(),
})

export type CreateUserIdResponse = {
  success: boolean
  errors?: any
  message?: string
  userId?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateUserIdResponse>
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

  let userId: string
  try {
    const userIdInput = `${body.data.address}-${getUserIdSalt()}`
    userId = createHash('sha256').update(userIdInput).digest('hex')
  } catch (e: any) {
    return res.status(500).send({
      success: false,
      errors: e.message,
    })
  }

  res.status(200).send({ success: true, userId })
}
