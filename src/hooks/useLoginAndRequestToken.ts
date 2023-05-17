import { useRequestToken } from '@/services/api/mutations'
import { useMyAccount } from '@/stores/my-account'
import { useMutation } from '@tanstack/react-query'

export default function useLoginAndRequestToken() {
  const { mutateAsync: requestToken } = useRequestToken()
  const loginAnonymously = useMyAccount((state) => state.loginAnonymously)

  const loginAndRequestToken = async (
    params: Omit<Parameters<typeof requestToken>[0], 'address'>
  ) => {
    const { captchaToken } = params
    const address = await loginAnonymously()
    if (!address) throw new Error('Failed to login')

    await requestToken({ address, captchaToken })
  }

  return useMutation(loginAndRequestToken)
}
