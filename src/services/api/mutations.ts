import { useMyAccount } from '@/stores/my-account'
import { MutationConfig, useSubsocialMutation } from '@/subsocial-query'
import mutationWrapper from '@/subsocial-query/base'
import { IpfsContent } from '@subsocial/api/substrate/wrappers'

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
    config
  )
}
