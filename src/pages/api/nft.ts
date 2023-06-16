import { nftChains } from '@/components/extensions/nft/utils'
import { covalentRequest } from '@/server/external'
import { MinimalUsageQueueWithTimeLimit } from '@/utils/data-structure'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const querySchema = z.object({
  chain: z.string(),
  collectionId: z.string(),
  nftId: z.string(),
})
export type ApiNftParams = z.infer<typeof querySchema>

type NftData = {
  name: string
  image: string
  collectionName: string
  price: number
}
export type ApiNftResponse = {
  success: boolean
  message: string
  errors?: any
  data?: NftData | null
}

const chainMapper: Record<(typeof nftChains)[number], string> = {
  ethereum: 'eth-mainnet',
  polygon: 'matic-mainnet',
  arbitrum: 'arbitrum-mainnet',
  avalanche: 'avalanche-mainnet',
  bsc: 'bsc-mainnet',
  optimism: 'optimism-mainnet',
  fantom: 'fantom-mainnet',
  astar: 'astar-mainnet',
  moonbeam: 'moonbeam-mainnet',
}

const MAX_NFTS_IN_CACHE = 500_000
const nftDataCache = new MinimalUsageQueueWithTimeLimit<NftData>(
  MAX_NFTS_IN_CACHE,
  6 * 60 // 6 hours
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiNftResponse>
) {
  if (req.method !== 'GET') return res.status(404).end()

  const params = querySchema.safeParse(req.query)
  if (!params.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: params.error.errors,
    })
  }

  const nftProperties = params.data

  const nftData = await getNftData(nftProperties)
  if (nftData) {
    res.json({
      message: 'OK',
      success: true,
      data: nftData,
    })
  } else {
    res.status(404).json({
      message: 'NFT not found',
      success: false,
      data: nftData,
    })
  }
}

function getNftCacheKey(nftProperties: ApiNftParams) {
  return `${nftProperties.chain}_${nftProperties.collectionId}_${nftProperties.nftId}`
}

async function getNftData(
  nftProperties: ApiNftParams
): Promise<NftData | null> {
  const chain = chainMapper[nftProperties.chain as keyof typeof chainMapper]
  if (!chain) return null

  const cacheKey = getNftCacheKey(nftProperties)
  if (nftDataCache.has(cacheKey)) {
    return nftDataCache.get(cacheKey) ?? null
  }

  try {
    const response = await covalentRequest({
      url: `/${chain}/nft/${nftProperties.collectionId}/metadata/${nftProperties.nftId}/`,
      params: {
        'with-uncached': true,
      },
    })

    const metadata = response.data?.data?.items?.[0]
    if (!metadata) {
      throw new Error('NFT not found')
    }

    const collectionName = metadata.contract_name
    const externalData = metadata.nft_data?.external_data
    const nftName = externalData?.name
    const image = externalData?.image

    const nftData = {
      name: nftName ?? collectionName ?? '',
      image: image ?? '',
      collectionName: collectionName ?? '',
      price: 0,
    }

    const isMetadataRecognizedAsValid = image
    if (isMetadataRecognizedAsValid) {
      nftDataCache.add(cacheKey, nftData)
    }

    return nftData
  } catch (e) {
    console.error('Fail to get nft data for nft:', cacheKey, e)
    return null
  }
}
