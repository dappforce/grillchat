import {
  ApiRequestTokenBody,
  ApiRequestTokenResponse,
} from '@/pages/api/request-token'
import { SaveFileRequest, SaveFileResponse } from '@/pages/api/save-file'
import mutationWrapper from '@/subsocial-query/base'
import axios from 'axios'

async function requestToken({ address, captchaToken }: ApiRequestTokenBody) {
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
  const res = await fetch('/api/save-file', {
    method: 'POST',
    body: JSON.stringify(content),
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  })
  const data = (await res.json()) as SaveFileResponse
  if (!data.success) throw new Error(data.errors)
  return data
}
