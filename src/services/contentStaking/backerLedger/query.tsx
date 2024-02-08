import { getSubIdRequest } from '@/server/external'
import { createQuery, poolQuery } from '@/subsocial-query'
import { BackerLedger } from './types'

export async function getBackerLedgerRequest(account: string) {
  return getSubIdRequest().get('/staking/creator/backer/ledger', {
    params: { account },
  })
}

const getBackerLedger = poolQuery<string, BackerLedger>({
  multiCall: async (account) => {
    const resultPromise = account.map(async (account) => {
      const result = await getBackerLedgerRequest(account)
      return { account, ...result.data }
    })

    return Promise.all(resultPromise)
  },
  resultMapper: {
    paramToKey: (id) => id,
    resultToKey: (item) => item.account,
  },
})
export const getBackerLedgerQuery = createQuery({
  key: 'backerLedger',
  fetcher: getBackerLedger,
})
