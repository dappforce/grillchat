import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import mutationWrapper from '@/subsocial-query/base'
import { useSubsocialMutation } from '@/subsocial-query/subsocial'
import { IpfsContent } from '@subsocial/api/substrate/wrappers'
import { PostData } from '@subsocial/api/types'
import { useQueryClient } from '@tanstack/react-query'
import { getCommentIdsQueryKey, getCommentQuery } from '../subsocial/queries'

async function signUp({
  address,
  captchaToken,
}: {
  captchaToken: string
  address: string
}) {
  const res = await fetch('/api/sign-up', {
    method: 'POST',
    body: JSON.stringify({ captchaToken, address }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  })
  return res.json()
}
export const useSignUp = mutationWrapper(signUp)

export type SendMessageParams = {
  message: string
  rootPostId: string
  spaceId: string
}
export function useSendMessage(config?: MutationConfig<SendMessageParams>) {
  const client = useQueryClient()
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)

  return useSubsocialMutation<SendMessageParams>(
    async () => ({ address, signer }),
    async (params, { ipfsApi, substrateApi }) => {
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
      onMutate: (params) => {
        const tempId = `optimistic-${params.rootPostId}-${Date.now()}`
        client.setQueryData(getCommentQuery.getQueryKey(tempId), {
          id: tempId,
          struct: {
            createdAtTime: Date.now(),
            ownerId: address,
          },
          content: {
            body: params.message,
          },
        } as PostData)
        client.setQueryData<string[]>(
          getCommentIdsQueryKey(params.rootPostId),
          (ids) => {
            return [...(ids ?? []), tempId]
          }
        )

        return { tempId }
      },
      onError: (_, params, context) => {
        const { tempId } = context as { tempId: string }
        client.removeQueries(getCommentQuery.getQueryKey(tempId))
        client.setQueryData<string[]>(
          getCommentIdsQueryKey(params.rootPostId),
          (ids) => {
            return ids?.filter((id) => id !== tempId)
          }
        )
      },
    }
  )
}
