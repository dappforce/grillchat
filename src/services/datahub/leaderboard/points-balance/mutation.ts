import { apiInstance } from '@/services/api/utils'
import mutationWrapper from '@/subsocial-query/base'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import {
  SocialCallDataArgs,
  SocialEventDataApiInput,
  SynthGamificationAddTappingActivityStatesCallParsedArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import { getCurrentWallet } from '../../../subsocial/hooks'
import { DatahubParams, createSignedSocialDataEvent } from '../../utils'

export type ApiDatahubPointsAndEnergyBody = {
  payload: SocialEventDataApiInput
}

export async function savePointsAndEnergy(
  params: DatahubParams<
    SocialCallDataArgs<'synth_gamification_add_tapping_activity_states'>
  >
) {
  params.isOffchain = true

  const input = createSignedSocialDataEvent(
    socialCallName.synth_gamification_add_tapping_activity_states,
    params,
    params.args
  )

  await apiInstance.post<any, any, ApiDatahubPointsAndEnergyBody>(
    '/api/datahub/points',
    {
      payload: input,
    }
  )
}

export const useSavePointsAndEnergy = mutationWrapper(
  async (data: SynthGamificationAddTappingActivityStatesCallParsedArgs) => {
    await savePointsAndEnergy({
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
