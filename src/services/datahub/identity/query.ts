import { apiInstance } from '@/services/api/utils'
import { createQuery } from '@/subsocial-query'
import { getLinkedIdentity } from './fetcher'

export const getLinkedIdentityQuery = createQuery({
  key: 'getLinkedIdentity',
  fetcher: (address: string) => getLinkedIdentity({ sessionAddress: address }),
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
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
