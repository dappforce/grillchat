import { DatahubMutationBody } from '@/pages/api/datahub/post'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import {
  IdentityProvider,
  SocialCallDataArgs,
  socialCallName,
  SynthCreateLinkedIdentityCallParsedArgs,
} from '@subsocial/data-hub-sdk'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import axios from 'axios'
import {
  createSignedSocialDataEvent,
  createSocialDataEventPayload,
  DatahubParams,
} from '../utils'

async function linkIdentity(
  params: DatahubParams<SocialCallDataArgs<'synth_create_linked_identity'>>
) {
  const { id, provider } = params.args
  params.backendSigning = true
  params.isOffchain = true

  const eventArgs: SynthCreateLinkedIdentityCallParsedArgs = {
    id,
    provider,
  }

  const input = createSocialDataEventPayload(
    socialCallName.synth_create_linked_identity,
    params,
    eventArgs
  )

  await axios.post<any, any, DatahubMutationBody>('/api/datahub/post', {
    action: 'link-identity',
    payload: input as any,
  })
}

// TODO: copy-paste from linkIdentity, so maybe refactor
async function unlinkIdentity(
  params: DatahubParams<{
    id: string
    provider: IdentityProvider
  }>
) {
  const { id, provider } = params.args
  params.backendSigning = true
  params.isOffchain = true
  const eventArgs: SynthCreateLinkedIdentityCallParsedArgs = {
    id,
    provider,
  }

  const input = createSignedSocialDataEvent(
    socialCallName.synth_delete_linked_identity,
    params,
    eventArgs
  )

  await axios.post<any, any, DatahubMutationBody>('/api/datahub/post', {
    action: 'unlink-identity',
    payload: input as any,
  })
}

type LinkIdentityParams = {
  external_id: string
  provider: IdentityProvider
}

// TODO: not sure that it is enough to use only this implementation
export function useLinkIdentity(
  config: UseMutationOptions<void, unknown, LinkIdentityParams, unknown>
) {
  return useMutation({
    ...config,
    mutationFn: async (data) => {
      await linkIdentity({
        ...getCurrentWallet(),
        args: {
          id: data.external_id,
          provider: data.provider,
        },
      })
    },
    onMutate: () => preventWindowUnload(),
    onError: (err, data, context) => {
      config.onError?.(err, data, context)
      allowWindowUnload()
    },
    onSuccess: (...params) => {
      config.onSuccess?.(...params)
      allowWindowUnload()
    },
  })
}
