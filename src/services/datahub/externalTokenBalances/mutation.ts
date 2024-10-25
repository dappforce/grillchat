import { apiInstance } from '@/services/api/utils'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { getMyMainAddress } from '@/stores/my-account'
import mutationWrapper from '@/subsocial-query/base'
import {
  SocialCallDataArgs,
  socialCallName,
  SynthSocialProfileSyncExternalTokenBalanceCallParsedArgs,
} from '@subsocial/data-hub-sdk'
import { createSignedSocialDataEvent, DatahubParams } from '../utils'

async function syncExternalTokenBalances(
  params: DatahubParams<
    SocialCallDataArgs<'synth_social_profile_sync_external_token_balance'>
  >
) {
  const input = await createSignedSocialDataEvent(
    socialCallName.synth_social_profile_sync_external_token_balance,
    params,
    params.args
  )

  await apiInstance.post<any, any, {}>('/api/datahub/external-token', {
    payload: input,
  })
}

export const syncExternalTokenBalancesCallbacks: {
  _data: Record<
    string,
    {
      onSuccessCallbacks: (() => void)[]
      onErrorCallbacks: (() => void)[]
    }
  >
  getKey: (data: { address: string; externalTokenId: string }) => string
  getCallbacks: (data: { address: string; externalTokenId: string }) => {
    onSuccessCallbacks: (() => void)[]
    onErrorCallbacks: (() => void)[]
  }
  setCallback: (
    data: { address: string; externalTokenId: string },
    {
      onSuccessCallbacks,
      onErrorCallbacks,
    }: {
      onSuccessCallbacks?: () => void
      onErrorCallbacks?: () => void
    }
  ) => void
  triggerCallbacks: (
    data: { address: string; externalTokenId: string },
    type: 'onSuccess' | 'onError'
  ) => void
} = {
  _data: {},
  getKey: ({ address, externalTokenId }) => `${address}-${externalTokenId}`,
  getCallbacks(data) {
    const key = this.getKey(data)
    if (!this._data[key]) {
      this._data[key] = {
        onSuccessCallbacks: [],
        onErrorCallbacks: [],
      }
    }
    return this._data[key]
  },
  setCallback(data, { onSuccessCallbacks, onErrorCallbacks }) {
    const key = this.getKey(data)
    if (!this._data[key]) {
      this._data[key] = {
        onSuccessCallbacks: [],
        onErrorCallbacks: [],
      }
    }
    if (onSuccessCallbacks) {
      this._data[key].onSuccessCallbacks.push(onSuccessCallbacks)
    }
    if (onErrorCallbacks) {
      this._data[key].onErrorCallbacks.push(onErrorCallbacks)
    }
  },
  triggerCallbacks(data, type) {
    const key = this.getKey(data)
    if (!this._data[key]) {
      return
    }
    const callbacks = this._data[key][`${type}Callbacks`]
    callbacks.forEach((cb) => cb())
    this._data[key] = {
      onSuccessCallbacks: [],
      onErrorCallbacks: [],
    }
  },
}
const useSyncExternalTokenBalancesRaw = mutationWrapper(
  async (data: SynthSocialProfileSyncExternalTokenBalanceCallParsedArgs) => {
    await syncExternalTokenBalances({
      ...getCurrentWallet(),
      args: data,
    })
  }
)
export function useSyncExternalTokenBalances(
  config?: Parameters<typeof useSyncExternalTokenBalancesRaw>[0] & {
    onSuccessSync?: () => void
    onErrorSync?: () => void
  }
) {
  return useSyncExternalTokenBalancesRaw({
    ...config,
    onMutate: (...params) => {
      const [{ externalTokenId }] = params
      config?.onMutate?.(...params)

      syncExternalTokenBalancesCallbacks.setCallback(
        { address: getMyMainAddress() ?? '', externalTokenId },
        {
          onSuccessCallbacks: config?.onSuccessSync,
          onErrorCallbacks: config?.onErrorSync,
        }
      )
    },
  })
}
