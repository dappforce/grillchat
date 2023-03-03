import mutationWrapper from '@/subsocial-query/base'

async function requestToken({
  address,
  captchaToken,
}: {
  captchaToken: string
  address: string
}) {
  const res = await fetch('/api/request-token', {
    method: 'POST',
    body: JSON.stringify({ captchaToken, address }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  })
  return res.json()
}
export const useRequestToken = mutationWrapper(requestToken)
