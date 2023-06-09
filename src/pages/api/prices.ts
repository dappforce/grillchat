import { MinimalUsageQueueWithTimeLimit } from '@/utils/data-structure'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { ApiAccountDataResponse } from './accounts-data'

const coingeckoUrl =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd'

type Price = {
  id: string
  current_price: number
}

const querySchema = z.object({
  tokensIds: z.array(z.string()),
})

export type ApiAccountsDataParams = z.infer<typeof querySchema>

export type ApiPricesResponse = {
  success: boolean
  message: string
  errors?: any
  data?: any
  hash?: string
}

const MAX_CACHE_ITEMS = 500_000
const priceCache = new MinimalUsageQueueWithTimeLimit<Price>(MAX_CACHE_ITEMS, 5)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiAccountDataResponse>
) {
  if (req.method !== 'GET') return res.status(404).end()

  const query = req.query.tokensIds
  const params = querySchema.safeParse({
    tokensIds: Array.isArray(query) ? query : [query],
  })
  if (!params.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: params.error.errors,
    })
  }

  const prices = await getPricesFromCache(params.data.tokensIds)

  return res.status(200).send({ success: true, message: 'OK', data: prices })
}

export async function getPricesFromCache(tokenIds: string[]) {
  const prices: Price[] = []
  const needToFetchIds: string[] = []

  let newlyFetchedData: Price[] = []
  tokenIds.forEach((tokenId) => {
    const cachedData = priceCache.get(tokenId)
    if (cachedData) {
      prices.push(cachedData)
    } else {
      needToFetchIds.push(tokenId)
    }
  })

  if (needToFetchIds.length > 0) {
    try {
      const res = await axios.get(
        `${coingeckoUrl}&ids=${needToFetchIds.join(',')}`
      )
      if (res.status !== 200) {
        console.error(
          `Failed request to ${coingeckoUrl} with status`,
          res.status
        )
      }

      res.data.forEach((priceItem: Price) => {
        priceCache.add(priceItem.id, priceItem)
      })

      newlyFetchedData.push(...res.data)
    } catch (e) {
      console.error(
        'Error fetching accounts data from Subsocial API: ',
        tokenIds,
        e
      )
    }
  }

  return [...prices, ...newlyFetchedData]
}
