import { getIpfsApi } from '@/server/ipfs'
import { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'
import { z } from 'zod'

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const bodySchema = z.object({
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
})

export type SaveFileResponse = {
  success: boolean
  errors?: any
  cid?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveFileResponse>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const parseRes = bodySchema.safeParse(req.body)
  if (!parseRes.success) {
    return res.status(400).send({
      success: false,
      errors: parseRes.error,
    })
  }

  const body = parseRes.data

  const { saveAndPinImage } = getIpfsApi()

  let cid: string
  const image = body.image
  try {
    const processedImage = sharp(image)
      .resize({
        fit: 'inside',
        width: 500,
        height: 500,
        withoutEnlargement: true,
      })
      .toBuffer()
    cid = await saveAndPinImage(processedImage)
  } catch (e: any) {
    console.log('Error saving image', e)
    return res.status(500).send({
      success: false,
      errors: e.message,
    })
  }

  res.status(200).send({ success: true, cid: cid })
}
