import { apiInstance } from '@/services/api/utils'
import { useMyAccount } from '@/stores/my-account'
import { createQuery } from '@/subsocial-query'
import { LocalStorage } from '@/utils/storage'
import { parseCachedPlaceholderData } from '../utils'
import { getLinkedIdentity } from './fetcher'

export const getMyLinkedIdentityCache = new LocalStorage(
  () => 'myLinkedIdentity'
)
export const getLinkedIdentityQuery = createQuery({
  key: 'getLinkedIdentity',
  fetcher: async (address: string) => {
    const res = await getLinkedIdentity({ sessionAddress: address })
    if (address === useMyAccount.getState().address) {
      getMyLinkedIdentityCache.set(JSON.stringify(res))
    }
    return res
  },
  defaultConfigGenerator: (data) => {
    let cache: Awaited<ReturnType<typeof getLinkedIdentity>> | undefined =
      undefined
    if (data === useMyAccount.getState().address) {
      const cacheData = getMyLinkedIdentityCache.get()
      cache = parseCachedPlaceholderData(cacheData)
    }
    return {
      enabled: !!data,
      placeholderData: cache,
    }
  },
})

export const getLinkedIdentityFromMainAddressQuery = createQuery({
  key: 'getLinkedIdentityFromMainAddress',
  fetcher: (mainAddress: string) => getLinkedIdentity({ id: mainAddress }),
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getEvmLinkedIdentityMessageQuery = createQuery({
  key: 'getEvmLinkedIdentityMessage',
  fetcher: async (address: string) => {
    const message = await apiInstance.get(
      `/api/datahub/identity?address=${address}`
    )
    return message.data.data as string
  },
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
    retry: false,
  }),
})
