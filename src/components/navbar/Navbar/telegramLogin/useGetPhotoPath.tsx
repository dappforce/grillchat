import axios from 'axios'
import { useEffect, useState } from 'react'

const telegramApiBaseUrl = 'https://api.telegram.org'

const apiToken = '7038999347:AAGBgXTWcXpR4vZPW9A8_ia9PkWOpeyDeWA'

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
  if (!photos) return

  const fileId = photos.result.photos[0][0].file_id

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

const useGetPhotoPath = (userId?: string) => {
  const [path, setPath] = useState<string>()

  useEffect(() => {
    if (!userId) return

    const getFunc = async () => {
      const res = await getPhotoPath(userId)

      setPath(res)
    }

    getFunc()
  }, [userId])

  return path
}

export default useGetPhotoPath
