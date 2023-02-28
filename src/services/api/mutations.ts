import mutationWrapper from '@/subsocial-query/base'

async function signUp({
  address,
  captchaToken,
}: {
  captchaToken: string
  address: string
}) {
  const res = await fetch('/api/sign-up', {
    method: 'POST',
    body: JSON.stringify({ captchaToken, address }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  })
  return res.json()
}
export const useSignUp = mutationWrapper(signUp)
