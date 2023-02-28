import mutationWrapper from '@/subsocial-query/base'

function signUp({
  address,
  captchaToken,
}: {
  captchaToken: string
  address: string
}) {
  return fetch('/api/sign-up', {
    method: 'POST',
    body: JSON.stringify({ captchaToken, address }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  }).then((res) => res.json())
}
export const useSignUp = mutationWrapper(signUp)
