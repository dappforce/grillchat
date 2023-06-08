import { AccountData } from '@/pages/api/accounts-data'
import { createQuery, poolQuery } from '@/subsocial-query'

import axios from 'axios'

export async function getAccountsData(addresses: string[]) {
  const requestedIds = addresses.filter((id) => !!id)
  if (requestedIds.length === 0) return []
  const res = await axios.get(
    '/api/accounts-data?' + requestedIds.map((n) => `addresses=${n}`).join('&')
  )

  return res.data.data as AccountData[]
}

const getAccountData = poolQuery<string, AccountData>({
  multiCall: async (addresses) => {
    if (addresses.length === 0) return []
    return getAccountsData(addresses)
  },
  resultMapper: {
    paramToKey: (address) => address,
    resultToKey: (result) => result?.grillAddress ?? '',
  },
})
export const getAccountDataQuery = createQuery({
  key: 'getAccountData',
  fetcher: getAccountData,
})
