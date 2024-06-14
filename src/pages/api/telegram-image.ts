import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'process'
import { z } from 'zod'

const querySchema = z.object({
  address: z.string(),
})
export type ApiPricesParams = z.infer<typeof querySchema>

export type ApiPricesResponse = {
  success: boolean
  message: string
  errors?: any
  data?: any
  hash?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiPricesResponse>
) {
  if (req.method !== 'GET') return res.status(404).end()

  const query = req.query.address
  const params = querySchema.safeParse({
    address: query?.toString(),
  })
  if (!params.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: params.error.errors,
    })
  }

  const telegramImage = await getPhotoPath(params.data.address)

  return res
    .status(200)
    .send({ success: true, message: 'OK', data: telegramImage })
}

const telegramApiBaseUrl = 'https://api.telegram.org'

const apiToken = env.TELEGRAM_BOT_TOKEN

const telegramApiUrl = `${telegramApiBaseUrl}/bot${apiToken}`

const getUserProfilePhotos = async (userId: string) => {
  try {
    const res = await axios.get(
      `${telegramApiUrl}/getUserProfilePhotos?user_id=${userId}&limit=1`
    )
    if (res.status !== 200) {
      console.error(`Failed request with status`, res.status)
    }

    return res.data
  } catch (e) {
    console.error('Error ', e)
    return
  }
}

const getPhotoPath = async (userId: string) => {
  const photos = await getUserProfilePhotos(userId)
  if (!photos?.result?.photos) return

  const fileId = photos.result.photos[0]?.[0].file_id

  if (!fileId) return

  try {
    const res = await axios.get(`${telegramApiUrl}/getFile?file_id=${fileId}`)
    if (res.status !== 200) {
      console.error(`Failed request with status`, res.status)
    }

    return `${telegramApiBaseUrl}/file/bot${apiToken}/${res.data.result.file_path}`
  } catch (e) {
    console.error('Error ', e)
    return
  }
}
