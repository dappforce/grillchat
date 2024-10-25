import { useRequestToken } from '@/old/services/api/mutation'
import {
  SendMessageParams,
  useSendMessage,
} from '@/old/services/subsocial/commentIds'
import { useMyMainAddress } from '@/stores/my-account'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import useLoginOption from './useLoginOption'

type Params = SendMessageParams
export default function useRequestTokenAndSendMessage(
  options?: UseMutationOptions<void, unknown, Params, unknown>
) {
  const address = useMyMainAddress()
  const { promptUserForLogin } = useLoginOption()

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
