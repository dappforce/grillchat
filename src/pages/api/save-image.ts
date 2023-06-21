import { getIpfsApi } from '@/server/ipfs'
import formidable from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export type SaveImageResponse = {
  success: boolean
  errors?: any
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

  const form = formidable({ maxFileSize: MAX_FILE_SIZE })
  const [_, files] = await form.parse(req)

  const image = files.image[0]

  const { saveAndPinImage } = getIpfsApi()

  let cid: string
  try {
    const processedImage = await sharp(image.filepath)
      .resize({
        fit: 'inside',
        width: 500,
        height: 500,
        withoutEnlargement: true,
      })
      .toFormat('jpeg')
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
