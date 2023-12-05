import { useRequestToken } from '@/services/api/mutation'
import {
  SendMessageParams,
  useSendMessage,
} from '@/services/subsocial/commentIds'
import { useMyMainAddress } from '@/stores/my-account'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import useLoginOptions from './useLoginOptions'

type Params = SendMessageParams
export default function useRequestTokenAndSendMessage(
  options?: UseMutationOptions<void, unknown, Params, unknown>
) {
  const address = useMyMainAddress()
  const { promptUserForLogin } = useLoginOptions()

  const { mutateAsync: requestToken } = useRequestToken()
  const { mutateAsync: sendMessage } = useSendMessage()

  const requestTokenAndSendMessage = async (params: Params) => {
    let usedAddress: string = address ?? ''
    if (!address) {
      const loginAddress = await promptUserForLogin()
      if (!loginAddress) return
      usedAddress = loginAddress
    }

    const promises: Promise<any>[] = [sendMessage(params)]
    promises.push(requestToken({ address: usedAddress }))

    await Promise.all(promises)
  }

  return useMutation(requestTokenAndSendMessage, options)
}
