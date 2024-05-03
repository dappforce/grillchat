import { ApiDatahubIdentityBody } from '@/pages/api/datahub/identity'
import { apiInstance } from '@/services/api/utils'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import mutationWrapper from '@/subsocial-query/base'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import {
  IdentityProvider,
  SocialCallDataArgs,
  SynthInitLinkedIdentityCallParsedArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import { DatahubParams, createSocialDataEventPayload } from '../utils'

export async function linkIdentity(
  params: Omit<
    DatahubParams<SocialCallDataArgs<'synth_init_linked_identity'>>,
    'signer'
  >
) {
  params.isOffchain = true

  const input = createSocialDataEventPayload(
    socialCallName.synth_init_linked_identity,
    params,
    params.args
  )

  await apiInstance.post<any, any, ApiDatahubIdentityBody>(
    '/api/datahub/identity',
    {
      payload: input,
      id: params.args.externalProvider?.id ?? '',
      provider:
        params.args.externalProvider?.provider ?? IdentityProvider.FARCASTER,
    }
  )
}

export const useLinkIdentity = mutationWrapper(
  async (data: SynthInitLinkedIdentityCallParsedArgs) => {
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
