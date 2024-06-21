import { getIsBalanceSufficientQuery } from '@/services/datahub/balances/query'
import { SocialAction } from '@/services/datahub/generated-query'
import { useSendMessage } from '@/services/datahub/posts/mutation'
import { augmentDatahubParams } from '@/services/datahub/utils'
import { SendMessageParams } from '@/services/subsocial/commentIds/types'
import { useMessageData } from '@/stores/message'
import { useMyMainAddress } from '@/stores/my-account'
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import useLoginOption from './useLoginOption'

type Params = SendMessageParams
export default function useSendMessageWithLoginFlow(
  options?: UseMutationOptions<string | null, unknown, Params, void>
) {
  const address = useMyMainAddress()
  const { promptUserForLogin } = useLoginOption()

  const { mutateAsync: sendMessage } = useSendMessage()
  const setOpenMessageModal = useMessageData.use.setOpenMessageModal()
  const client = useQueryClient()

  const handler = async (params: Params) => {
    let usedAddress: string = address ?? ''
    if (!address) {
      const loginAddress = await promptUserForLogin()
      if (!loginAddress) return null
      usedAddress = loginAddress
    }

    const isSufficient = await getIsBalanceSufficientQuery.fetchQuery(client, {
      address: usedAddress,
      socialAction: SocialAction.CreateComment,
    })
    if (!isSufficient) {
      setOpenMessageModal('not-enough-balance')
      return null
    }

    const augmented = await augmentDatahubParams(params)
    return await sendMessage(augmented)
  }

  return useMutation(handler, options)
}
