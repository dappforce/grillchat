import { getIpfsApi } from '@/server/ipfs'
import formidable from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export type SaveImageResponse = {
  success: boolean
  errors?: any
  message: string
  cid?: string
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveImageResponse>
) {
  if (req.method !== 'POST') return res.status(404).end()

  let image: any = null
  try {
    const form = formidable({ maxFileSize: MAX_FILE_SIZE })
    const [_, files] = await form.parse(req)

    image = files.image[0]
  } catch (e: any) {
    return res.status(500).send({
      message: 'Image is too large, max size is 2MB',
      success: false,
      errors: e.message,
    })
  }

  const { saveAndPinImage } = getIpfsApi()

  let cid: string
  try {
    const processedImage = await sharp(image.filepath)
      .flatten({ background: '#ffffff' })
      .resize({
        fit: 'inside',
        width: 1600,
        height: 1024,
        withoutEnlargement: true,
      })
      .toFormat('jpeg')
      .toBuffer()

    cid = await saveAndPinImage(processedImage)
  } catch (e: any) {
    console.error('Error saving image', e)
    return res.status(500).send({
      message: 'Error saving image',
      success: false,
      errors: e.message,
    })
  }

  res.status(200).send({ success: true, cid: cid, message: 'OK' })
}
