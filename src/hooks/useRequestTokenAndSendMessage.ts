import { useRequestToken } from '@/services/api/mutations'
import { useSendMessage } from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { useMutation } from '@tanstack/react-query'

export default function useRequestTokenAndSendMessage() {
  const address = useMyAccount((state) => state.address)

  const { mutateAsync: requestToken } = useRequestToken()
  const { mutateAsync: sendMessage } = useSendMessage()
  const login = useMyAccount((state) => state.loginAnonymously)

  const requestTokenAndSendMessage = async (
    params: Omit<Parameters<typeof requestToken>[0], 'address'> &
      Parameters<typeof sendMessage>[0]
  ) => {
    const { captchaToken, ...sendMessageParams } = params
    let usedAddress: string = address ?? ''
    if (!address) {
      const address = await login()
      if (!address) throw new Error('Failed to login')
      usedAddress = address
    }

    await requestToken({ address: usedAddress, captchaToken })
    await sendMessage(sendMessageParams)
  }

  return useMutation(requestTokenAndSendMessage)
}
