import { createQuery } from '@/subsocial-query'
import axios from 'axios'
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
    const message = await axios.get(`/api/datahub/identity?address=${address}`)
    return message.data.data as string
  },
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
    retry: false,
  }),
})
