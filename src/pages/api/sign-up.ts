// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const schema = z.object({
  captchaToken: z.string(),
  address: z.string(),
})

type Data = {
  message: string
}

const VERIFIER = 'https://hcaptcha.com/siteverify'
const TEST_SECRET = '0x0000000000000000000000000000000000000000'
async function verifyCaptcha(captchaToken: string) {
  const formData = new FormData()
  formData.append('secret', TEST_SECRET)
  formData.append('response', captchaToken)
  const res = await fetch(VERIFIER, {
    method: 'POST',
    body: formData,
  })
  const jsonRes = await res.json()
  console.log(jsonRes)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const body = schema.safeParse(req.body)
  if (!body.success) {
    return res.status(400).send({
      message: `Invalid request body: ${body.error.message}`,
    })
  }

  await verifyCaptcha(body.data.captchaToken)
  return res.status(200).send({ message: 'OK' })
}
