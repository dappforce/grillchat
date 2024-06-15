import { ApiDatahubIdentityBody } from '@/pages/api/datahub/identity'
import { apiInstance } from '@/services/api/utils'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import mutationWrapper from '@/subsocial-query/base'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import {
  SocialCallDataArgs,
  SynthCreateLinkedIdentityCallParsedArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import { DatahubParams, createSocialDataEventPayload } from '../utils'

export async function linkIdentity(
  params: Omit<
    DatahubParams<SocialCallDataArgs<'synth_create_linked_identity'>>,
    'signer'
  >
) {
  const { id, provider } = params.args
  params.isOffchain = true

  const eventArgs: SynthCreateLinkedIdentityCallParsedArgs = {
    id,
    provider,
  }
  const input = await createSocialDataEventPayload(
    socialCallName.synth_create_linked_identity,
    params,
    eventArgs
  )

  await apiInstance.post<any, any, ApiDatahubIdentityBody>(
    '/api/datahub/identity',
    {
      payload: input,
      id,
      provider,
    }
  )
}

export const useLinkIdentity = mutationWrapper(
  async (data: SynthCreateLinkedIdentityCallParsedArgs) => {
    await linkIdentity({
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
