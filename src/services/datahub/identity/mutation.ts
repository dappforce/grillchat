import { ApiDatahubIdentityBody } from '@/pages/api/datahub/identity'
import { apiInstance } from '@/services/api/utils'
import { queryClient } from '@/services/provider'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import mutationWrapper from '@/subsocial-query/base'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import {
  IdentityProvider,
  SocialCallDataArgs,
  SynthAddLinkedIdentityExternalProviderCallParsedArgs,
  SynthInitLinkedIdentityCallParsedArgs,
  SynthUpdateLinkedIdentityExternalProviderCallParsedArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import {
  DatahubParams,
  createSignedSocialDataEvent,
  createSocialDataEventPayload,
} from '../utils'
import { Identity } from './fetcher'
import { getLinkedIdentityQuery } from './query'

export async function linkIdentity(
  params: DatahubParams<SocialCallDataArgs<'synth_init_linked_identity'>>
) {
  params.isOffchain = true

  const input = await createSocialDataEventPayload(
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

export function reloadEveryIntervalUntilLinkedIdentityFound(
  foundChecker: (linkedIdentity: Identity | null) => boolean
) {
  const intervalId = setInterval(async () => {
    const address = getCurrentWallet().address
    if (
      queryClient &&
      foundChecker(getLinkedIdentityQuery.getQueryData(queryClient, address))
    ) {
      clearInterval(intervalId)
      return
    }

    const res = await getLinkedIdentityQuery.fetchQuery(
      queryClient,
      address,
      true
    )
    if (foundChecker(res)) {
      clearInterval(intervalId)
    }
  }, 2_000)
  setTimeout(() => {
    clearInterval(intervalId)
  }, 10_000)
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
      reloadEveryIntervalUntilLinkedIdentityFound((identity) => !!identity)
      allowWindowUnload()
    },
  }
)

async function addExternalProviderToIdentity(
  params: DatahubParams<
    SocialCallDataArgs<'synth_add_linked_identity_external_provider'>
  >
) {
  const input = await createSignedSocialDataEvent(
    socialCallName.synth_add_linked_identity_external_provider,
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

export const useAddExternalProviderToIdentity = mutationWrapper(
  async (data: SynthAddLinkedIdentityExternalProviderCallParsedArgs) => {
    await addExternalProviderToIdentity({
      ...getCurrentWallet(),
      args: data,
    })
  },
  {
    onSuccess: (_, { externalProvider }) => {
      reloadEveryIntervalUntilLinkedIdentityFound(
        (identity) =>
          !!identity?.externalProviders.find(
            (p) =>
              // @ts-expect-error different provider for IdentityProvider, one from generated type, one from sdk
              p.provider === externalProvider.provider &&
              p.externalId === externalProvider.id &&
              p.enabled
          )
      )
    },
  }
)

async function updateExternalProvider(
  params: DatahubParams<
    SocialCallDataArgs<'synth_update_linked_identity_external_provider'>
  >
) {
  const input = await createSignedSocialDataEvent(
    socialCallName.synth_update_linked_identity_external_provider,
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

export const useUpdateExternalProvider = mutationWrapper(
  async (data: SynthUpdateLinkedIdentityExternalProviderCallParsedArgs) => {
    await updateExternalProvider({
      ...getCurrentWallet(),
      args: data,
    })
  },
  {
    onSuccess: (_, { externalProvider }) => {
      reloadEveryIntervalUntilLinkedIdentityFound((identity) => {
        const isFound = !!identity?.externalProviders.find(
          (p) =>
            // @ts-expect-error different provider for IdentityProvider, one from generated type, one from sdk
            p.provider === externalProvider.provider &&
            p.externalId === externalProvider.id
        )
        if (!externalProvider.enabled) return !isFound
        return isFound
      })
    },
  }
)
