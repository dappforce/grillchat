import { apiInstance } from '@/services/api/utils'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import mutationWrapper from '@/subsocial-query/base'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import {
  SocialCallDataArgs,
  SocialEventDataApiInput,
  SynthGamificationClaimTaskCallParsedArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import { DatahubParams, createSignedSocialDataEvent } from '../utils'

export type ApiDatahubClaimTaskPointsBody = {
  payload: SocialEventDataApiInput
}

export async function claimTaskTokens(
  params: DatahubParams<SocialCallDataArgs<'synth_gamification_claim_task'>>
) {
  params.isOffchain = true

  const input = await createSignedSocialDataEvent(
    socialCallName.synth_gamification_claim_task,
    params,
    params.args
  )

  await apiInstance.post<any, any, ApiDatahubClaimTaskPointsBody>(
    '/api/datahub/claim-task-tokens',
    {
      payload: input,
    }
  )
}

export const useClaimTaskTokens = mutationWrapper(
  async (data: SynthGamificationClaimTaskCallParsedArgs) => {
    await claimTaskTokens({
      ...getCurrentWallet(),
      args: data,
    })
  },
  {
    onMutate: () => {
      preventWindowUnload()
    },
    onError: () => {
      allowWindowUnload()
    },
    onSuccess: () => {
      allowWindowUnload()
    },
  }
)
