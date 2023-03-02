import useWaitHasBalance from '@/hooks/useWaitHasBalance'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial'
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

  const waitHasBalance = useWaitHasBalance()

  return useSubsocialMutation<SendMessageParams, string>(
    async () => ({ address, signer }),
    async (params, { ipfsApi, substrateApi }) => {
      await waitHasBalance()
      const cid = await ipfsApi.saveContent({
        body: params.message,
      } as any)
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
