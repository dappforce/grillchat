import { apiInstance } from '@/services/api/utils'
import { useEffect, useState } from 'react'

const useGetPhotoPath = (userId?: string) => {
  const [path, setPath] = useState<string>()

  useEffect(() => {
    if (!userId) return

    const getFunc = async () => {
      const res = await apiInstance.get(`/api/telegram-image?address=${userId}`)
      setPath(res.data)
    }

    getFunc()
  }, [userId])

  return path
}

export default useGetPhotoPath
