import { ApiDatahubContentStakingMutationBody } from '@/pages/api/datahub/content-staking'
import { ApiDatahubSuperLikeMutationBody } from '@/pages/api/datahub/super-like'
import { apiInstance } from '@/services/api/utils'
import { queryClient } from '@/services/provider'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { getMyMainAddress } from '@/stores/my-account'
import mutationWrapper from '@/subsocial-query/base'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { SocialCallDataArgs, socialCallName } from '@subsocial/data-hub-sdk'
import {
  DatahubParams,
  createSignedSocialDataEvent,
  createSocialDataEventPayload,
} from '../utils'
import {
  getAddressLikeCountToPostQuery,
  getSuperLikeCountQuery,
  getTodaySuperLikeCountQuery,
} from './query'

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

export const pendingSuperLikes = new Set<string>()
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
      if (queryClient) {
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

        getTodaySuperLikeCountQuery.setQueryData(
          queryClient,
          mainAddress,
          (oldData) => {
            if (!oldData) return { count: 1 }
            return {
              ...oldData,
              count: oldData.count + 1,
            }
          }
        )
      }
    },
    onError: (_, { postId }) => {
      const mainAddress = getMyMainAddress()
      if (!mainAddress) return
      if (queryClient) {
        getAddressLikeCountToPostQuery.invalidate(queryClient, {
          postId,
          address: mainAddress,
        })

        getTodaySuperLikeCountQuery.setQueryData(
          queryClient,
          mainAddress,
          (oldData) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              count: oldData.count - 1,
            }
          }
        )
      }
      allowWindowUnload()
    },
    onSuccess: () => {
      allowWindowUnload()
    },
  }
)

type ClaimDailyRewardArgs =
  SocialCallDataArgs<'synth_gamification_claim_entrance_daily_reward'>
async function claimDailyReward(params: DatahubParams<ClaimDailyRewardArgs>) {
  const input = await createSignedSocialDataEvent(
    socialCallName.synth_gamification_claim_entrance_daily_reward,
    params,
    undefined
  )

  await apiInstance.post<any, any, ApiDatahubContentStakingMutationBody>(
    '/api/datahub/content-staking',
    input as any
  )
}

export const useClaimDailyReward = mutationWrapper(async () => {
  await claimDailyReward({
    ...getCurrentWallet(),
    args: undefined as any,
  })
})
