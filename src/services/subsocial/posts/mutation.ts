import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import useWaitNewBlock from '@/hooks/useWaitNewBlock'
import { saveFile } from '@/services/api/mutation'
import { getPostQuery } from '@/services/api/query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { IpfsWrapper } from '@/utils/ipfs'
import { PostContent } from '@subsocial/api/types'
import { useQueryClient } from '@tanstack/react-query'
import { useWalletGetter } from '../hooks'
import { createMutationWrapper } from '../utils'
import {
  getFollowedPostIdsByAddressQuery,
  getPostIdsBySpaceIdQuery,
} from './query'

export type JoinChatParams = {
  chatId: string
}
export function useJoinChat(config?: SubsocialMutationConfig<JoinChatParams>) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<JoinChatParams>(
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
export function useLeaveChat(
  config?: SubsocialMutationConfig<LeaveChatParams>
) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<JoinChatParams>(
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
  body?: string
}
export type UpsertChatParams = ({ postId: string } | { spaceId: string }) &
  Content
export function useUpsertChat(
  config?: SubsocialMutationConfig<UpsertChatParams>
) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()
  const waitNewBlock = useWaitNewBlock()

  return useSubsocialMutation<UpsertChatParams>(
    getWallet,
    async ({ image, title, body, ...params }, { substrateApi }) => {
      console.log('waiting energy...')
      await waitHasEnergy()

      const { success, cid } = await saveFile({
        title,
        body,
        image,
      })
      if (!success || !cid) throw new Error('Failed to save file')

      if ('postId' in params && params.postId) {
        return {
          tx: substrateApi.tx.posts.updatePost(params.postId, {
            content: IpfsWrapper(cid),
          }),
          summary: 'Updating chat',
        }
      } else if ('spaceId' in params && params.spaceId) {
        return {
          tx: substrateApi.tx.posts.createPost(
            params.spaceId,
            { RegularPost: null },
            IpfsWrapper(cid)
          ),
          summary: 'Creating chat',
        }
      }

      throw new Error('Invalid params')
    },
    config,
    {
      txCallbacks: {
        onSend: ({ data }) => {
          if ('postId' in data && data.postId) {
            getPostQuery.setQueryData(client, data.postId, (post) => {
              if (!post) return post
              return {
                ...post,
                content: {
                  ...post.content,
                  title: data.title,
                  image: data.image,
                  body: data.body ?? '',
                } as PostContent,
              }
            })
          }
        },
        onSuccess: async ({ data }) => {
          if ('spaceId' in data && data.spaceId) {
            getPostIdsBySpaceIdQuery.invalidate(client, data.spaceId)
          } else if ('postId' in data && data.postId) {
            getPostQuery.invalidate(client, data.postId)
          }
        },
      },
    }
  )
}
export const UpsertChatWrapper = createMutationWrapper(
  useUpsertChat,
  'Failed to upsert chat'
)
