import { createQuery, poolQuery } from '@/subsocial-query'
import { SubsocialProfile, getProfiles } from './fetcher'

const getProfile = poolQuery<string, SubsocialProfile>({
  name: 'getProfile',
  multiCall: async (addresses) => {
    if (addresses.length === 0) return []
    return getProfiles(addresses)
  },
  resultMapper: {
    paramToKey: (address) => address,
    resultToKey: (result) => result?.address ?? '',
  },
})
export const getProfileQuery = createQuery({
  key: 'profile',
  fetcher: getProfile,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})
