import { useSignUp } from '@/services/api/mutations'
import { useSendMessage } from '@/services/subsocial/mutations'
import { useMyAccount } from '@/stores/my-account'
import { useMutation } from '@tanstack/react-query'

export function useSignUpAndSendMessage() {
  const { mutateAsync: signUp } = useSignUp()
  const { mutateAsync: sendMessage } = useSendMessage()
  const login = useMyAccount((state) => state.login)

  const signUpAndSendMessage = async (
    params: Parameters<typeof signUp>[0] &
      Parameters<typeof sendMessage>[0] & { secretKey: string }
  ) => {
    const { address, captchaToken, secretKey, ...sendMessageParams } = params
    const successLogin = await login(secretKey)
    if (!successLogin) throw new Error('Failed to login')

    await signUp({ address, captchaToken })
    console.log('sending msg...', sendMessageParams)
    await sendMessage(sendMessageParams)
  }

  return useMutation(signUpAndSendMessage)
}
