import { useRequestToken } from '@/services/api/mutations'
import { useSendMessage } from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { useMutation } from '@tanstack/react-query'

export function useRequestTokenAndSendMessage() {
  const { mutateAsync: requestToken } = useRequestToken()
  const { mutateAsync: sendMessage } = useSendMessage()
  const login = useMyAccount((state) => state.login)

  const requestTokenAndSendMessage = async (
    params: Parameters<typeof requestToken>[0] &
      Parameters<typeof sendMessage>[0] & { secretKey: string }
  ) => {
    const { address, captchaToken, secretKey, ...sendMessageParams } = params
    const successLogin = await login(secretKey)
    if (!successLogin) throw new Error('Failed to login')

    await requestToken({ address, captchaToken })
    await sendMessage(sendMessageParams)
  }

  return useMutation(requestTokenAndSendMessage)
}
