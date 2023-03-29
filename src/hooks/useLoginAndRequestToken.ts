import { useRequestToken } from '@/services/api/mutations'
import { useMyAccount } from '@/stores/my-account'
import { generateAccount } from '@/utils/account'
import { useMutation } from '@tanstack/react-query'

export default function useLoginAndRequestToken() {
  const { mutateAsync: requestToken } = useRequestToken()
  const login = useMyAccount((state) => state.login)

  const loginAndRequestToken = async (
    params: Omit<Parameters<typeof requestToken>[0], 'address'>
  ) => {
    const { captchaToken } = params
    const { publicKey, secretKey } = await generateAccount()
    const successLogin = await login(secretKey)
    if (!successLogin) throw new Error('Failed to login')

    await requestToken({ address: publicKey, captchaToken })
  }

  return useMutation(loginAndRequestToken)
}
