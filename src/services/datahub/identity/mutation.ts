import { DatahubMutationBody } from '@/pages/api/datahub'
import { useWalletGetter } from '@/services/subsocial/hooks'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import {
  IdentityProvider,
  socialCallName,
  SynthCreateLinkedIdentityCallParsedArgs,
} from '@subsocial/data-hub-sdk'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import axios from 'axios'
import { createSocialDataEventInput, DatahubParams } from '../utils'

async function linkIdentity(
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

  const input = createSocialDataEventInput(
    socialCallName.synth_create_linked_identity,
    params,
    eventArgs
  )

  await axios.post<any, any, DatahubMutationBody>('/api/datahub', {
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

  const input = createSocialDataEventInput(
    socialCallName.synth_delete_linked_identity,
    params,
    eventArgs
  )

  await axios.post<any, any, DatahubMutationBody>('/api/datahub', {
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
  const getWallet = useWalletGetter()

  return useMutation({
    ...config,
    mutationFn: async (data) => {
      preventWindowUnload()
      await linkIdentity({
        ...getWallet(),
        args: {
          id: data.external_id,
          provider: data.provider,
        },
      })
    },
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
