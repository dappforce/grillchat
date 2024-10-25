import { createQuery } from '@/old/subsocial-query'
import { getLinkedIdentity } from './fetcher'

export const getLinkedIdentityQuery = createQuery({
  key: 'getLinkedIdentity',
  fetcher: getLinkedIdentity,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})
