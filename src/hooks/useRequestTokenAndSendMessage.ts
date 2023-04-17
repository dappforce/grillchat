import { useRequestToken } from '@/services/api/mutations'
import {
  SendMessageParams,
  useSendOrEditMessage,
} from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { useMutation } from '@tanstack/react-query'

export default function useRequestTokenAndSendMessage() {
  const address = useMyAccount((state) => state.address)

  const { mutateAsync: requestToken } = useRequestToken()
  const { mutateAsync: sendOrEditMessage } = useSendOrEditMessage()
  const login = useMyAccount((state) => state.login)

  const requestTokenAndSendMessage = async (
    params: Omit<Parameters<typeof requestToken>[0], 'address'> &
      SendMessageParams
  ) => {
    const { captchaToken, ...sendMessageParams } = params
    let usedAddress: string = address ?? ''
    if (!address) {
      const address = await login()
      if (!address) throw new Error('Failed to login')
      usedAddress = address
    }

    await requestToken({ address: usedAddress, captchaToken })
    await sendOrEditMessage(sendMessageParams)
  }

  return useMutation(requestTokenAndSendMessage)
}
