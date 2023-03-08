import {
  RequestTokenParams,
  RequestTokenResponse,
} from '@/pages/api/request-token'
import mutationWrapper from '@/subsocial-query/base'

async function requestToken({ address, captchaToken }: RequestTokenParams) {
  const res = await fetch('/api/request-token', {
    method: 'POST',
    body: JSON.stringify({ captchaToken, address }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  })
  const data = (await res.json()) as RequestTokenResponse
  if (!data.success) throw new Error(data.message)
  return data
}
export const useRequestToken = mutationWrapper(requestToken)
