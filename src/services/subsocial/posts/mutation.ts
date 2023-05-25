import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'

export type JoinChatParams = {
  chatId: string
}
export function useJoinChat(config?: MutationConfig<JoinChatParams>) {
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<JoinChatParams, string>(
    async () => ({ address, signer }),
    async ({ chatId }, { substrateApi }) => {
      console.log('waiting energy...')
      await waitHasEnergy()

      return {
        tx: substrateApi.tx.postFollows.followPost(chatId),
        summary: 'Joining chat',
      }
    },
    config,
    {}
  )
}
