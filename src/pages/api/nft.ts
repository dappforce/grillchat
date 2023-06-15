import { nftChains } from '@/components/extensions/nft/utils'
import { getMoralisApi } from '@/server/external'
import { MinimalUsageQueueWithTimeLimit } from '@/utils/data-structure'
import { EvmChain } from '@moralisweb3/common-evm-utils'
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

const moralisChainMapper: Record<(typeof nftChains)[number], EvmChain> = {
  ethereum: EvmChain.ETHEREUM,
  polygon: EvmChain.POLYGON,
  arbitrum: EvmChain.ARBITRUM,
  avalanche: EvmChain.AVALANCHE,
  bsc: EvmChain.BSC,
  optimism: EvmChain.OPTIMISM,
  fantom: EvmChain.FANTOM,
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

  res.json({
    message: 'OK',
    success: true,
    data: nftData,
  })
}

function getNftCacheKey(nftProperties: ApiNftParams) {
  return `${nftProperties.chain}_${nftProperties.collectionId}_${nftProperties.nftId}`
}

async function getNftData(
  nftProperties: ApiNftParams
): Promise<NftData | null> {
  const chain =
    moralisChainMapper[nftProperties.chain as keyof typeof moralisChainMapper]
  if (!chain) return null

  const cacheKey = getNftCacheKey(nftProperties)
  if (nftDataCache.has(cacheKey)) {
    return nftDataCache.get(cacheKey) ?? null
  }

  try {
    const moralis = await getMoralisApi()

    const response = await moralis?.EvmApi.nft.getNFTMetadata({
      address: nftProperties.collectionId,
      tokenId: nftProperties.nftId,
      chain,
      normalizeMetadata: true,
    })
    const metadata = response?.raw.normalized_metadata

    let image = metadata?.image
    if (!image) {
      const rawMetadata = response?.raw.metadata
      const parsedMetadata = JSON.parse(rawMetadata ?? '{}')
      image = parsedMetadata?.image || parsedMetadata.image_data
    }

    const nftData = {
      name: metadata?.name ?? '',
      image: image ?? '',
      collectionName: response?.raw.name ?? '',
      price: 0,
    }

    nftDataCache.add(cacheKey, nftData)
    return nftData
  } catch (e) {
    console.error('Fail to get nft data for nft:', cacheKey, e)
    return null
  }
}

// TODO: if want to use opensea price data
// const openseaChainMapper: Record<(typeof nftChains)[number], string> = {
//   ethereum: 'ethereum',
//   polygon: 'matic',
//   arbitrum: 'arbitrum',
//   avalanche: 'avalanche',
//   bsc: 'bsc',
//   optimism: 'optimism',
//   fantom: '',
// }

// async function getNftPrice(nft: ApiNftParams) {
//   if (!getOpenSeaApiKey()) return ''
//   if (!nft) return 'Price not found'

//   const mappedChain =
//     openseaChainMapper[nft.chain as keyof typeof openseaChainMapper]
//   if (!mappedChain) return 'Price not found'

//   const apiUrl = `https://api.opensea.io/v2/orders/${nft.chain}/seaport/listings?asset_contract_address=${nft.collectionId}&limit=1&token_ids=${nft.nftId}&order_by=eth_price&order_direction=asc`
//   const response = await axios.get(apiUrl, {
//     headers: {
//       'X-API-KEY': getOpenSeaApiKey(),
//     },
//   })

//   const [order] = response.data?.orders ?? []
//   const price = order?.current_price

//   if (!price) {
//     return 'Not for sale'
//   }

//   const takerAsset = order?.taker_asset_bundle?.assets[0]
//   const assetContract = takerAsset?.asset_contract

//   const symbol = assetContract?.symbol || '~'
//   const decimals = takerAsset?.decimals || 18

//   const { BigNumber } = await import('bignumber.js')
//   const parsedPrice = new BigNumber(price)
//     .div(new BigNumber(10).pow(new BigNumber(decimals)))
//     .toString()

//   return `${parsedPrice} ${symbol}`
// }
