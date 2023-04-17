import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useSaveFile } from '@/services/api/mutations'
import { getPostQuery } from '@/services/api/query'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { DefaultSubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { IpfsWrapper, ReplyWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { PostContent } from '@subsocial/api/types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { generateOptimisticId } from '../utils'
import {
  addOptimisticData,
  deleteOptimisticData,
  updateDataOptimistically,
} from './optimistic'
import { OptimisticMessageIdData, SendMessageParams } from './types'

const generateContent = (params: SendMessageParams) => {
  let content: PostContent = {
    body: params.message,
  } as PostContent
  if (params.selectedMessage?.type === 'reply') {
    content = {
      ...content,
      inReplyTo: ReplyWrapper(params.selectedMessage.id),
    }
  }
  return content
}

function createPostTxCallbacks(
  client: QueryClient
): DefaultSubsocialMutationConfig<SendMessageParams, string>['txCallbacks'] {
  return {
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
  }
}
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
      const { cid, success } = await saveFile(generateContent(params))
      if (!success) throw new Error('Failed to save file to IPFS')

      let tx = substrateApi.tx.posts.createPost(
        null,
        { Comment: { parentId: null, rootPostId: params.rootPostId } },
        IpfsWrapper(cid)
      )
      if (params.selectedMessage?.type === 'edit') {
        const { id } = params.selectedMessage
        tx = substrateApi.tx.posts.updatePost(id, {
          content: IpfsWrapper(cid),
        })
      }

      return {
        tx,
        summary: 'Sending message',
      }
    },
    config,
    {
      txCallbacks: createPostTxCallbacks(client),
    }
  )
}

function updatePostTxCallbacks(
  client: QueryClient
): DefaultSubsocialMutationConfig<SendMessageParams, string>['txCallbacks'] {
  return {
    getContext: ({ param: { selectedMessage } }) => selectedMessage?.id ?? '',
    onStart: async ({ param: { message } }, id) => {
      if (!id) return
      updateDataOptimistically(client, id, message)
    },
    onSuccess: (_, id) => {
      getPostQuery.invalidate(client, id)
    },
    onError: (_, id) => {
      getPostQuery.invalidate(client, id)
    },
  }
}
export function useEditMessage(config?: MutationConfig<SendMessageParams>) {
  const client = useQueryClient()
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)

  const { mutateAsync: saveFile } = useSaveFile()

  const waitHasBalance = useWaitHasEnergy()

  return useSubsocialMutation<SendMessageParams, string>(
    async () => ({ address, signer }),
    async (params, { substrateApi }) => {
      await waitHasBalance()
      const { cid, success } = await saveFile(generateContent(params))
      if (!success) throw new Error('Failed to save file to IPFS')
      if (params.selectedMessage?.type !== 'edit')
        throw new Error('Invalid edit message params')

      const { id } = params.selectedMessage
      const tx = substrateApi.tx.posts.updatePost(id, {
        content: IpfsWrapper(cid),
      })

      return {
        tx,
        summary: 'Editing message',
      }
    },
    config,
    {
      txCallbacks: updatePostTxCallbacks(client),
    }
  )
}

export function useSendOrEditMessage() {
  const {
    mutate: sendMessage,
    error: errorSend,
    isLoading: loadingSend,
  } = useSendMessage()
  const {
    mutate: editMessage,
    error: errorEdit,
    isLoading: loadingEdit,
  } = useEditMessage()

  return {
    error: errorSend || errorEdit,
    isLoading: loadingSend || loadingEdit,
    mutateAsync: async (params: SendMessageParams) => {
      if (params.selectedMessage?.type === 'edit') {
        return editMessage(params)
      }
      return sendMessage(params)
    },
  }
}
