import { useSendMessage } from '@/services/datahub/posts/mutation'
import { augmentDatahubParams } from '@/services/datahub/utils'
import { SendMessageParams } from '@/services/subsocial/commentIds/types'
import { useMyMainAddress } from '@/stores/my-account'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import useLoginOption from './useLoginOption'

type Params = SendMessageParams
export default function useSendMessageWithLoginFlow(
  options?: UseMutationOptions<void, unknown, Params, unknown>
) {
  const address = useMyMainAddress()
  const { promptUserForLogin } = useLoginOption()

  const { mutateAsync: sendMessage } = useSendMessage()

  const handler = async (params: Params) => {
    let usedAddress: string = address ?? ''
    if (!address) {
      const loginAddress = await promptUserForLogin()
      if (!loginAddress) return
      usedAddress = loginAddress
    }

    await sendMessage(augmentDatahubParams(params))
  }

  return useMutation(handler, options)
}
