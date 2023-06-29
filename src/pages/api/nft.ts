import { nftChains } from '@/components/extensions/nft/utils'
import { ApiResponse, handlerWrapper } from '@/server/common'
import { covalentRequest } from '@/server/external'
import { getIpfsApi } from '@/server/ipfs'
import { MinimalUsageQueueWithTimeLimit } from '@/utils/data-structure'
import { getCidFromMetadataLink, getIpfsContentUrl } from '@/utils/ipfs'
import { Prefix as KodadotClient } from '@kodadot1/static'
import { getClient } from '@kodadot1/uniquery'
import { NextApiRequest } from 'next'
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
type NftResponseData = {
  data?: NftData | null
}
export type ApiNftResponse = ApiResponse<NftResponseData>

const covalentChainMapper: Record<(typeof nftChains)[number], string> = {
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

const kodadotChainMapper: Record<(typeof nftChains)[number], string> = {
  statemine: 'stmn',
  kusama: 'ksm',
  rmrk: 'rmrk',
  basilisk: 'bsx',
}

const chainMapper: Record<(typeof nftChains)[number], string> = {
  ...covalentChainMapper,
  ...kodadotChainMapper,
}

const MAX_NFTS_IN_CACHE = 500_000
const nftDataCache = new MinimalUsageQueueWithTimeLimit<NftData>(
  MAX_NFTS_IN_CACHE,
  6 * 60 // 6 hours
)

export default handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req: NextApiRequest) => req.query,
})<NftResponseData>({
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const nftProperties = data

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
  },
})

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
    let nftData: NftData | null = null
    let isMetadataRecognizedAsValid = false

    if (kodadotChainMapper[nftProperties.chain]) {
      const client = getClient(chain as KodadotClient)

      const query = client.itemById(decodeURI(nftProperties.nftId))
      const result = await client.fetch(query)

      const nftChainData = (result as any)?.data?.item //TODO: fix types

      if (!nftChainData) {
        throw new Error('NFT not found')
      }

      const cidMetadata = getCidFromMetadataLink(nftChainData.metadata)

      const { ipfs } = getIpfsApi()

      const metadata = await ipfs.getContent<any>(cidMetadata)
      if (!metadata) {
        throw new Error('NFT metadata not found')
      }

      const imageCid = getCidFromMetadataLink(
        metadata?.image || metadata?.mediaUri
      )

      nftData = {
        name: nftChainData.name ?? '',
        image: imageCid ? getIpfsContentUrl(imageCid) : '',
        collectionName: '',
        price: 0,
      }
      isMetadataRecognizedAsValid = !!imageCid
    } else {
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

      nftData = {
        name: nftName ?? collectionName ?? '',
        image: image ?? '',
        collectionName: collectionName ?? '',
        price: 0,
      }
      isMetadataRecognizedAsValid = image
    }

    if (isMetadataRecognizedAsValid) {
      nftDataCache.add(cacheKey, nftData)
    }

    return nftData
  } catch (e) {
    console.error('Fail to get nft data for nft:', cacheKey, e)
    return null
  }
}
