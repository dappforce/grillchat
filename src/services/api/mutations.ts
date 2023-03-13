import {
  ApiRequestTokenBody,
  ApiRequestTokenResponse,
} from '@/pages/api/request-token'
import mutationWrapper from '@/subsocial-query/base'
import axios from 'axios'

async function requestToken({ address, captchaToken }: ApiRequestTokenBody) {
  const res: ApiRequestTokenResponse = await axios.post('/api/request-token', {
    body: { captchaToken, address },
  })
  if (!res.success) throw new Error(res.message)
  return res
}
export const useRequestToken = mutationWrapper(requestToken)
