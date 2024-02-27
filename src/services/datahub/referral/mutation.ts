import { ApiDatahubSuperLikeMutationBody } from '@/pages/api/datahub/super-like'
import { apiInstance } from '@/services/api/utils'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import mutationWrapper from '@/subsocial-query/base'
import { SocialCallDataArgs, socialCallName } from '@subsocial/data-hub-sdk'
import { DatahubParams, createSocialDataEventPayload } from '../utils'

type SetReferrerIdArgs =
  SocialCallDataArgs<'synth_social_profile_add_referrer_id'>
async function setReferrerId(params: DatahubParams<SetReferrerIdArgs>) {
  const input = createSocialDataEventPayload(
    socialCallName.synth_social_profile_add_referrer_id,
    params,
    params.args
  )

  await apiInstance.post<any, any, ApiDatahubSuperLikeMutationBody>(
    '/api/datahub/referral',
    input as any
  )
}

export const useSetReferrerId = mutationWrapper(
  async (data: SetReferrerIdArgs) => {
    await setReferrerId({
      ...getCurrentWallet(),
      args: data,
    })
  }
)
