import { ApiDatahubSuperLikeMutationBody } from '@/pages/api/datahub/super-like'
import { apiInstance } from '@/services/api/utils'
import { queryClient } from '@/services/provider'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { getMyMainAddress } from '@/stores/my-account'
import mutationWrapper from '@/subsocial-query/base'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { SocialCallDataArgs, socialCallName } from '@subsocial/data-hub-sdk'
import { DatahubParams, createSocialDataEventPayload } from '../utils'
import { getAddressLikeCountToPostQuery, getSuperLikeCountQuery } from './query'

type CreateSuperLikeArgs =
  SocialCallDataArgs<'synth_active_staking_create_super_like'>
async function createSuperLike(params: DatahubParams<CreateSuperLikeArgs>) {
  const input = createSocialDataEventPayload(
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
