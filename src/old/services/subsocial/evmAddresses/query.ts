import { apiInstance } from '@/old/services/api/utils'
import { createQuery, poolQuery } from '@/old/subsocial-query'
import { AccountData } from '@/pages/api/accounts-data'

export async function getAccountsData(addresses: string[]) {
  const requestedIds = addresses.filter((id) => !!id)
  if (requestedIds.length === 0) return []
  const res = await apiInstance.get(
    '/api/accounts-data?' + requestedIds.map((n) => `addresses=${n}`).join('&')
  )

  return res.data.data as AccountData[]
}

const getAccountData = poolQuery<string, AccountData>({
  name: 'getAccountData',
  multiCall: async (addresses) => {
    const filteredAddresses = addresses.filter(Boolean)
    if (filteredAddresses.length === 0) return []
    return getAccountsData(filteredAddresses)
  },
  resultMapper: {
    paramToKey: (address) => address,
    resultToKey: (result) => result?.grillAddress ?? '',
  },
})
export const getAccountDataQuery = createQuery({
  key: 'account',
  fetcher: getAccountData,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})
