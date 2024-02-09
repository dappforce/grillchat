import { ApiDatahubPostMutationBody } from '@/pages/api/datahub/post'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import mutationWrapper from '@/subsocial-query/base'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { SocialCallDataArgs, socialCallName } from '@subsocial/data-hub-sdk'
import axios from 'axios'
import { DatahubParams, createSignedSocialDataEvent } from '../utils'

type CreateSuperLikeArgs =
  SocialCallDataArgs<'synth_active_staking_create_super_like'>
async function createSuperlike(params: DatahubParams<CreateSuperLikeArgs>) {
  params.isOffchain = true
  const api = await getSubsocialApi()
  const substrateApi = await api.substrateApi
  params.args.blockHash = (
    await substrateApi.rpc.chain.getBlockHash()
  ).toString()

  const input = createSignedSocialDataEvent(
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
