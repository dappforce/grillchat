import {
  ApiRequestTokenBody,
  ApiRequestTokenResponse,
} from '@/pages/api/request-token'
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
