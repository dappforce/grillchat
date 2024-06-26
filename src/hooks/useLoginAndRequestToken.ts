import { useRequestToken } from '@/services/api/mutation'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useMutation } from '@tanstack/react-query'

export default function useLoginAndRequestToken(
  config?: MutationConfig<any> & { asTemporaryAccount?: boolean }
) {
  const { mutateAsync: requestToken } = useRequestToken()
  const login = useMyAccount((state) => state.login)
  const currentAddress = useMyAccount((state) => state.address)
  const loginAsTemporaryAccount = useMyAccount(
    (state) => state.loginAsTemporaryAccount
  )

  const loginAndRequestToken = async () => {
    const loginFunc = config?.asTemporaryAccount
      ? loginAsTemporaryAccount
      : login
    let address: string | false | null = currentAddress
    if (!address) {
      address = await loginFunc()
      if (!address) throw new Error('Failed to login')
    }

    await requestToken({ address })

    return address
  }

  return useMutation(loginAndRequestToken, config)
}
