import { getSubIdRequest } from '@/server/external'
import { createQuery, poolQuery } from '@/subsocial-query'
import { isDef } from '@subsocial/utils'
import { AccountInfoByChain } from './types'
import { buildBalancesKey } from './utils'

const getBalancesByNetwork = async (
  account: string,
  network: string
): Promise<Record<string, AccountInfoByChain>> => {
  const balances = await getSubIdRequest().get(
    `/${account}/balances/${network}`
  )

  return balances.data
}

type BalanceKey = {
  address: string
  chainName: string
}

const getBalancesCall = poolQuery<
  BalanceKey,
  { key: string; balances: Record<string, AccountInfoByChain> }
>({
  multiCall: async (keys) => {
    const promises = keys.map(async ({ address, chainName }) => {
      const result = await getBalancesByNetwork(address, chainName)

      return {
        key: buildBalancesKey(address, chainName),
        balances: result || {},
      }
    })

    const balancesRes = await Promise.allSettled(promises)

    return balancesRes
      .map((balance) =>
        balance.status === 'fulfilled' ? balance.value : undefined
      )
      .filter(isDef)
  },
  resultMapper: {
    paramToKey: ({ address, chainName }) =>
      buildBalancesKey(address, chainName),
    resultToKey: (result) => result.key,
  },
})
export const getBalancesQuery = createQuery({
  key: 'balances',
  fetcher: getBalancesCall,
})
