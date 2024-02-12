import { ApiDatahubPostMutationBody } from '@/pages/api/datahub/post'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import mutationWrapper from '@/subsocial-query/base'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { SocialCallDataArgs, socialCallName } from '@subsocial/data-hub-sdk'
import axios from 'axios'
import { DatahubParams, createSocialDataEventPayload } from '../utils'

type CreateSuperLikeArgs =
  SocialCallDataArgs<'synth_active_staking_create_super_like'>
async function createSuperlike(params: DatahubParams<CreateSuperLikeArgs>) {
  const input = createSocialDataEventPayload(
    socialCallName.synth_active_staking_create_super_like,
    params,
    params.args
  )

  await axios.post<any, any, ApiDatahubPostMutationBody>('/api/datahub/post', {
    payload: input as any,
    action: 'create-superlike',
  })
}

export const useCreateSuperlike = mutationWrapper(
  async (data: CreateSuperLikeArgs) => {
    await createSuperlike({
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
