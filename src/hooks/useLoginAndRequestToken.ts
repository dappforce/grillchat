import { useRequestToken } from '@/services/api/mutation'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useMutation } from '@tanstack/react-query'

export default function useLoginAndRequestToken(config?: MutationConfig<any>) {
  const { mutateAsync: requestToken } = useRequestToken()
  const login = useMyAccount((state) => state.login)

  const loginAndRequestToken = async (
    params: Omit<Parameters<typeof requestToken>[0], 'address'>
  ) => {
    const { captchaToken } = params
    const address = await login()
    if (!address) throw new Error('Failed to login')

    await requestToken({ address, captchaToken })

    return address
  }

  return useMutation(loginAndRequestToken, config)
}
