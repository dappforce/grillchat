import { ApiProfilesResponse } from '@/pages/api/profiles'
import { apiInstance } from '@/services/api/utils'
import { createQuery, poolQuery } from '@/subsocial-query'
import { SubsocialProfile } from './fetcher'

const getProfile = poolQuery<string, SubsocialProfile>({
  name: 'getProfile',
  multiCall: async (addresses) => {
    if (addresses.length === 0) return []
    const res = await apiInstance.get(
      '/api/profiles?' + addresses.map((n) => `addresses=${n}`).join('&')
    )
    const data = res.data as ApiProfilesResponse
    return data.data ?? []
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
