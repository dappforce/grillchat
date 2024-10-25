import { apiInstance } from '@/old/services/api/utils'
import { queryClient } from '@/old/services/provider'
import { getCurrentWallet } from '@/old/services/subsocial/hooks'
import mutationWrapper from '@/old/subsocial-query/base'
import { ApiDatahubSuperLikeMutationBody } from '@/pages/api/datahub/super-like'
import { getMyMainAddress } from '@/stores/my-account'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { SocialCallDataArgs, socialCallName } from '@subsocial/data-hub-sdk'
import { DatahubParams, createSocialDataEventPayload } from '../utils'
import { getAddressLikeCountToPostQuery, getSuperLikeCountQuery } from './query'

type CreateSuperLikeArgs =
  SocialCallDataArgs<'synth_active_staking_create_super_like'>
async function createSuperLike(params: DatahubParams<CreateSuperLikeArgs>) {
  const input = await createSocialDataEventPayload(
    socialCallName.synth_active_staking_create_super_like,
    params,
    params.args
  )

  await apiInstance.post<any, any, ApiDatahubSuperLikeMutationBody>(
    '/api/datahub/super-like',
    { payload: input as any }
  )
}

export const useCreateSuperLike = mutationWrapper(
  async (data: CreateSuperLikeArgs) => {
    await createSuperLike({
      ...getCurrentWallet(),
      args: data,
    })
  },
  {
    onMutate: ({ postId }) => {
      preventWindowUnload()
      const mainAddress = getMyMainAddress()
      if (!mainAddress) return
      getSuperLikeCountQuery.setQueryData(queryClient, postId, (oldData) => {
        if (!oldData)
          return {
            count: 1,
            postId,
          }
        return {
          ...oldData,
          count: oldData.count + 1,
        }
      })
      getAddressLikeCountToPostQuery.setQueryData(
        queryClient,
        { address: mainAddress, postId },
        () => {
          return {
            address: mainAddress,
            count: 1,
            postId,
          }
        }
      )
    },
    onError: (_, { postId }) => {
      const mainAddress = getMyMainAddress()
      if (!mainAddress) return
      getAddressLikeCountToPostQuery.invalidate(queryClient, {
        postId,
        address: mainAddress,
      })
      allowWindowUnload()
    },
    onSuccess: () => {
      allowWindowUnload()
    },
  }
)
