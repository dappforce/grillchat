import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { saveFile } from '@/services/api/mutation'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { IpfsWrapper } from '@/utils/ipfs'
import { useQueryClient } from '@tanstack/react-query'
import { useWalletGetter } from '../hooks'
import { createMutationWrapper } from '../utils'
import { getFollowedPostIdsByAddressQuery } from './query'

export type JoinChatParams = {
  chatId: string
}
export function useJoinChat(config?: MutationConfig<JoinChatParams>) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<JoinChatParams, null>(
    getWallet,
    async ({ chatId }, { substrateApi }) => {
      console.log('waiting energy...')
      await waitHasEnergy()

      return {
        tx: substrateApi.tx.postFollows.followPost(chatId),
        summary: 'Joining chat',
      }
    },
    config,
    {
      txCallbacks: {
        getContext: () => null,
        onSend: ({ address, data }) => {
          getFollowedPostIdsByAddressQuery.setQueryData(
            client,
            address,
            (ids) => [...(ids ?? []), data.chatId]
          )
        },
        onError: ({ address }) => {
          getFollowedPostIdsByAddressQuery.invalidate(client, address)
        },
        onSuccess: ({ address }) => {
          getFollowedPostIdsByAddressQuery.invalidate(client, address)
        },
      },
    }
  )
}
export const JoinChatWrapper = createMutationWrapper(
  useJoinChat,
  'Failed to join chat'
)

export type LeaveChatParams = {
  chatId: string
}
export function useLeaveChat(config?: MutationConfig<LeaveChatParams>) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<JoinChatParams, null>(
    getWallet,
    async ({ chatId }, { substrateApi }) => {
      console.log('waiting energy...')
      await waitHasEnergy()

      return {
        tx: substrateApi.tx.postFollows.unfollowPost(chatId),
        summary: 'Leaving chat',
      }
    },
    config,
    {
      txCallbacks: {
        getContext: () => null,
        onSend: ({ address, data }) => {
          getFollowedPostIdsByAddressQuery.setQueryData(
            client,
            address,
            (ids) => ids?.filter((id) => id !== data.chatId)
          )
        },
        onError: ({ address }) => {
          getFollowedPostIdsByAddressQuery.invalidate(client, address)
        },
        onSuccess: ({ address }) => {
          getFollowedPostIdsByAddressQuery.invalidate(client, address)
        },
      },
    }
  )
}
export const LeaveChatWrapper = createMutationWrapper(
  useLeaveChat,
  'Failed to leave chat'
)

type Content = {
  image: string
  title: string
  description?: string
}
export type UpsertChatParams = ({ postId: string } | { spaceId: string }) &
  Content
export function useUpsertChat(config?: MutationConfig<UpsertChatParams>) {
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<UpsertChatParams, null>(
    getWallet,
    async ({ image, title, description, ...params }, { substrateApi }) => {
      console.log('waiting energy...')
      await waitHasEnergy()

      const { success, cid } = await saveFile({
        title,
        description,
        image,
      })
      if (!success) throw new Error('Failed to save file')

      if ('postId' in params) {
        return {
          tx: substrateApi.tx.posts.updatePost(params.postId, {
            content: cid,
          }),
          summary: 'Updating chat',
        }
      } else {
        return {
          tx: substrateApi.tx.posts.createPost(
            params.spaceId,
            { RegularPost: null },
            IpfsWrapper(cid)
          ),
          summary: 'Creating chat',
        }
      }
    },
    config
  )
}
export const UpsertChatWrapper = createMutationWrapper(
  useUpsertChat,
  'Failed to upsert chat'
)
