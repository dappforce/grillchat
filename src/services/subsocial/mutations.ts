import useWaitHasBalance from '@/hooks/useWaitHasBalance'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial'
import { IpfsContent } from '@subsocial/api/substrate/wrappers'
import { PostData } from '@subsocial/api/types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { getCommentIdsQueryKey, getPost } from '../subsocial/queries'
import { generateOptimisticId } from './utils'

export type SendMessageParams = {
  message: string
  rootPostId: string
  spaceId: string
}
type OptimisticGeneratorParam = {
  client: QueryClient
  param: SendMessageParams
  tempId: string
  address: string
}
function addOptimisticData({
  client,
  param,
  tempId,
  address,
}: OptimisticGeneratorParam) {
  client.setQueryData(getPost.getQueryKey(tempId), {
    id: tempId,
    struct: {
      createdAtTime: Date.now(),
      ownerId: address,
    },
    content: {
      body: param.message,
    },
  } as PostData)
  client.setQueryData<string[]>(
    getCommentIdsQueryKey(param.rootPostId),
    (ids) => {
      return [...(ids ?? []), tempId]
    }
  )
}
function deleteOptimisticData({
  client,
  param,
  tempId,
}: OptimisticGeneratorParam) {
  client.removeQueries(getPost.getQueryKey(tempId))
  client.setQueryData<string[]>(
    getCommentIdsQueryKey(param.rootPostId),
    (ids) => {
      return ids?.filter((id) => id !== tempId)
    }
  )
}
export function useSendMessage(config?: MutationConfig<SendMessageParams>) {
  const client = useQueryClient()
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)

  const waitHasBalance = useWaitHasBalance()

  return useSubsocialMutation<SendMessageParams, string>(
    async () => ({ address, signer }),
    async (params, { ipfsApi, substrateApi }) => {
      console.log('waiting balance')
      await waitHasBalance()
      console.log('done balance')
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
        getContext: () => generateOptimisticId(),
        onStart: ({ address, param }, tempId) =>
          addOptimisticData({ address, param, tempId, client }),
        onError: ({ address, param }, tempId) =>
          deleteOptimisticData({ tempId, address, client, param }),
        onSuccess: ({ param }) => {
          client.invalidateQueries(getCommentIdsQueryKey(param.rootPostId))
        },
      },
    }
  )
}
