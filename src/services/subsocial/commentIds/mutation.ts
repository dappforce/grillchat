import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useSaveFile } from '@/services/api/mutations'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { IpfsContent } from '@subsocial/api/substrate/wrappers'
import { useQueryClient } from '@tanstack/react-query'
import { generateOptimisticId } from '../utils'
import { addOptimisticData, deleteOptimisticData } from './optimistic'
import { OptimisticMessageIdData, SendMessageParams } from './types'

export function useSendMessage(config?: MutationConfig<SendMessageParams>) {
  const client = useQueryClient()
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)

  const { mutateAsync: saveFile } = useSaveFile()

  const waitHasBalance = useWaitHasEnergy()

  return useSubsocialMutation<SendMessageParams, string>(
    async () => ({ address, signer }),
    async (params, { substrateApi }) => {
      await waitHasBalance()
      const { cid, success } = await saveFile({
        body: params.message,
      } as any)

      if (!success) throw new Error('Failed to save file to IPFS')

      return {
        tx: substrateApi.tx.posts.createPost(
          params.spaceId,
          { Comment: { parentId: null, rootPostId: params.rootPostId } },
          IpfsContent(cid)
        ),
        summary: 'Sending message',
      }
    },
    config,
    {
      txCallbacks: {
        // Removal of optimistic comment generated is done by the subscription of commentIds
        // this is done to prevent a bit of flickering because the optimistic comment is done first, before the comment data finished fetching
        getContext: ({ param, address }) =>
          generateOptimisticId<OptimisticMessageIdData>({
            address,
            message: param.message,
          }),
        onStart: ({ address, param }, tempId) => {
          preventWindowUnload()
          addOptimisticData({ address, param, tempId, client })
        },
        onSend: allowWindowUnload,
        onError: ({ address, param }, tempId) => {
          allowWindowUnload()
          deleteOptimisticData({ tempId, address, client, param })
        },
      },
    }
  )
}
