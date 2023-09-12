import { CreateUserIdResponse } from '@/pages/api/create-user-id'
import {
  ApiDiscussionInput,
  ApiDiscussionResponse,
} from '@/pages/api/discussion'
import { ApiPostsInvalidationResponse } from '@/pages/api/posts'
import {
  ApiRequestTokenBody,
  ApiRequestTokenResponse,
} from '@/pages/api/request-token'
import { SaveFileRequest, SaveFileResponse } from '@/pages/api/save-file'
import { SaveImageResponse } from '@/pages/api/save-image'
import mutationWrapper from '@/subsocial-query/base'
import axios from 'axios'

export async function requestToken({
  address,
  captchaToken,
}: ApiRequestTokenBody) {
  const res = await axios.post('/api/request-token', {
    captchaToken,
    address,
  })
  const data = res.data as ApiRequestTokenResponse
  if (!data.success) throw new Error(data.message)
  return res
}
export const useRequestToken = mutationWrapper(requestToken)

export async function saveFile(content: SaveFileRequest) {
  const res = await axios.post('/api/save-file', content)
  const data = res.data as SaveFileResponse
  if (!data.success) throw new Error(data.errors)
  return data
}
export const useSaveFile = mutationWrapper(saveFile)

export async function createUserId(address: string) {
  const res = await axios.post('/api/create-user-id', { address })
  const data = res.data as CreateUserIdResponse
  if (!data.success || !data.userId) throw new Error(data.errors)
  return data.userId
}

export async function createDiscussion(content: ApiDiscussionInput) {
  const res = await axios.post('/api/discussion', content)
  const data = res.data as ApiDiscussionResponse
  if (!data.success) throw new Error(data.errors)
  return data
}
export const useCreateDiscussion = mutationWrapper(createDiscussion)

export async function saveImage(content: File) {
  const formData = new FormData()
  formData.append('image', content)
  const res = await axios.post('/api/save-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  const data = res.data as SaveImageResponse
  if (!data.success) throw new Error(data.errors)
  return data
}
export const useSaveImage = mutationWrapper(saveImage)

// NOTE: this invalidations won't work if server doesn't have redis
export async function invalidatePostServerCache(postId: string) {
  const res = await axios.post('/api/posts', { postId })
  return res.data as ApiPostsInvalidationResponse
}
export async function invalidateProfileServerCache(address: string) {
  const res = await axios.post('/api/profile', { address })
  return res.data as ApiPostsInvalidationResponse
}
