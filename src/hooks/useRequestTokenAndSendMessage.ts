import { useRequestToken } from '@/services/api/mutation'
import {
  SendMessageParams,
  useSendMessage,
} from '@/services/subsocial/commentIds'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'

type Params = SendMessageParams & {
  captchaToken: string
}
export default function useRequestTokenAndSendMessage(
  options?: UseMutationOptions<void, unknown, Params, unknown>
) {
  const address = useMyMainAddress()

  const { mutateAsync: requestToken } = useRequestToken()
  const { mutateAsync: sendMessage } = useSendMessage()
  const login = useMyAccount((state) => state.login)

  const requestTokenAndSendMessage = async (params: Params) => {
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

  return useMutation(requestTokenAndSendMessage, options)
}
