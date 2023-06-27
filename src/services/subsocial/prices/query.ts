import { createQuery, poolQuery } from '@/subsocial-query'
import axios from 'axios'

export const coingeckoTokenIds: Record<string, string> = {
  eth: 'ethereum',
  matic: 'matic-network',
  usdc: 'usd-coin',
  usdt: 'tether',
}

export type Price = {
  id: string
  current_price: string | null
}

export async function getPrices(tokenIds: string[]) {
  const requestedIds = tokenIds.filter((id) => !!id)
  if (requestedIds.length === 0) return []
  const res = await axios.get(
    '/api/prices?' + requestedIds.map((n) => `tokensIds=${n}`).join('&')
  )

  return res.data.data as Price[]
}

const getPrice = poolQuery<string, Price>({
  multiCall: async (tokensIds) => {
    if (tokensIds.length === 0) return []
    return getPrices(tokensIds)
  },
  resultMapper: {
    paramToKey: (id) => id,
    resultToKey: (result) => result?.id ?? '',
  },
})
export const getPriceQuery = createQuery({
  key: 'getPrices',
  fetcher: getPrice,
})
