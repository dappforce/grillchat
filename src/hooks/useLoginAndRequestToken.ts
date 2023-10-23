import { useRequestToken } from '@/services/api/mutation'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useMutation } from '@tanstack/react-query'

export default function useLoginAndRequestToken(
  config?: MutationConfig<any> & { asTemporaryAccount?: boolean }
) {
  const { mutateAsync: requestToken } = useRequestToken()
  const login = useMyAccount((state) => state.login)
  const loginAsTemporaryAccount = useMyAccount(
    (state) => state.loginAsTemporaryAccount
  )

  const loginAndRequestToken = async (
    params: Omit<Parameters<typeof requestToken>[0], 'address'>
  ) => {
    const { captchaToken } = params
    const loginFunc = config?.asTemporaryAccount
      ? loginAsTemporaryAccount
      : login
    const address = await loginFunc()
    if (!address) throw new Error('Failed to login')

    await requestToken({ address, captchaToken })

    return address
  }

  return useMutation(loginAndRequestToken, config)
}
