import useWaitHasBalance from '@/hooks/useWaitHasBalance'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial'
import { IpfsContent } from '@subsocial/api/substrate/wrappers'
import { PostData } from '@subsocial/api/types'
import { useQueryClient } from '@tanstack/react-query'
import { getCommentIdsQueryKey, getCommentQuery } from '../subsocial/queries'
import { generateOptimisticId } from './utils'

export type SendMessageParams = {
  message: string
  rootPostId: string
  spaceId: string
}
export function useSendMessage(config?: MutationConfig<SendMessageParams>) {
  const client = useQueryClient()
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)

  const waitHasBalance = useWaitHasBalance()

  return useSubsocialMutation<SendMessageParams>(
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
      optimistic: {
        getTempId: () => generateOptimisticId(),
        addData: ({ param, tempId }) => {
          client.setQueryData(getCommentQuery.getQueryKey(tempId!), {
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
              return [...(ids ?? []), tempId!]
            }
          )
        },
        removeData: ({ tempId, param }) => {
          client.removeQueries(getCommentQuery.getQueryKey(tempId!))
          client.setQueryData<string[]>(
            getCommentIdsQueryKey(param.rootPostId),
            (ids) => {
              return ids?.filter((id) => id !== tempId)
            }
          )
        },
      },
    }
  )
}
