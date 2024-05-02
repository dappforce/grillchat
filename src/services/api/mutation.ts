import { CreateUserIdResponse } from '@/pages/api/create-user-id'
import { RevalidateChatInput } from '@/pages/api/revalidation/chat'
import { SaveFileRequest, SaveFileResponse } from '@/pages/api/save-file'
import { SaveImageResponse } from '@/pages/api/save-image'
import mutationWrapper from '@/subsocial-query/base'
import { apiInstance } from './utils'

export async function saveFile(content: SaveFileRequest) {
  const res = await apiInstance.post('/api/save-file', content)
  const data = res.data as SaveFileResponse
  if (!data.success) throw new Error(data.errors)
  return data
}
export const useSaveFile = mutationWrapper(saveFile, { retry: 2 })

export async function createUserId(address: string) {
  const res = await apiInstance.post('/api/create-user-id', { address })
  const data = res.data as CreateUserIdResponse
  if (!data.success || !data.userId) throw new Error(data.errors)
  return data.userId
}

export async function saveImage(content: File) {
  const formData = new FormData()
  formData.append('image', content)
  const res = await apiInstance.post('/api/save-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  const data = res.data as SaveImageResponse
  if (!data.success) throw new Error(data.errors)
  return data
}
export const useSaveImage = mutationWrapper(saveImage, {
  retry: 2,
})

export function revalidateChatPage(input: RevalidateChatInput) {
  return apiInstance.post('/api/revalidation/chat', input)
}
export const useRevalidateChatPage = mutationWrapper(revalidateChatPage)
