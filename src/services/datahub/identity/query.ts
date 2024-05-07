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
