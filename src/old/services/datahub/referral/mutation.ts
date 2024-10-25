import { apiInstance } from '@/old/services/api/utils'
import { getCurrentWallet } from '@/old/services/subsocial/hooks'
import mutationWrapper from '@/old/subsocial-query/base'
import { ApiDatahubSuperLikeMutationBody } from '@/pages/api/datahub/super-like'
import {
  DataHubClientId,
  SocialCallDataArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import { DatahubParams, createSocialDataEventPayload } from '../utils'

type SetReferrerIdArgs =
  SocialCallDataArgs<'synth_social_profile_add_referrer_id'>
async function setReferrerId(params: DatahubParams<SetReferrerIdArgs>) {
  const input = await createSocialDataEventPayload(
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
  async ({
    walletType,
    ...data
  }: Omit<SetReferrerIdArgs, 'clientId'> & {
    walletType?: 'injected' | 'grill'
  }) => {
    if (!data.refId) return
    await setReferrerId({
      ...getCurrentWallet(walletType),
      args: { ...data, clientId: DataHubClientId.GRILLSO },
    })
  }
)
