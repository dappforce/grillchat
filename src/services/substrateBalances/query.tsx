import { getSubIdRequest } from '@/server/external'
import { createQuery, poolQuery } from '@/subsocial-query'
import { isDef } from '@subsocial/utils'
import { AccountInfoByChain } from './types'

const getBalancesByNetwork = async (
  account: string,
  network: string
): Promise<Record<string, AccountInfoByChain>> => {
  const balances = await getSubIdRequest().get(
    `/${account}/balances/${network}`
  )

  return balances.data
}

const getBalancesCall = poolQuery<
  string,
  { key: string; balances: Record<string, AccountInfoByChain> }
>({
  multiCall: async (keys) => {
    const promises = keys.map(async (key) => {
      const [account, network] = key.split('|')

      const result = await getBalancesByNetwork(account, network)

      return { key, balances: result || {} }
    })

    const balancesRes = await Promise.allSettled(promises)

    return balancesRes
      .map((balance) =>
        balance.status === 'fulfilled' ? balance.value : undefined
      )
      .filter(isDef)
  },
  resultMapper: {
    paramToKey: (key) => key,
    resultToKey: (result) => result.key,
  },
})
export const getBalancesQuery = createQuery({
  key: 'balances',
  fetcher: getBalancesCall,
})
