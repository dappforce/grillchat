import { getSubIdRequest } from '@/services/external'
import { createQuery, poolQuery } from '@/subsocial-query'
import BN from 'bignumber.js'
import { BackerLedger, UnbondingChunks } from './types'

export async function getBackerLedgerRequest(account: string) {
  return getSubIdRequest().get('staking/creator/backer/ledger', {
    params: { account },
  })
}

const getBackerLedger = poolQuery<string, BackerLedger>({
  multiCall: async (account) => {
    const resultPromise = account.map(async (account) => {
      const result = await getBackerLedgerRequest(account)

      const backerLedgerData = result?.data

      const unbondingChunks = backerLedgerData?.unbondingInfo
        .unbondingChunks as UnbondingChunks[]

      let lockedBN = new BN(backerLedgerData?.totalLocked || '0')

      unbondingChunks?.forEach(({ amount }) => {
        lockedBN = lockedBN.minus(amount)
      })

      return { account, locked: lockedBN.toString(), ...result.data }
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
