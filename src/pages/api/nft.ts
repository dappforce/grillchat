import { nftChains } from '@/components/extensions/nft/utils'
import { redisCallWrapper } from '@/old/server/cache'
import { ApiResponse, handlerWrapper } from '@/old/server/common'
import { covalentRequest } from '@/old/server/external'
import { getIpfsApi } from '@/old/server/ipfs'
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

export default handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req: NextApiRequest) => req.query,
})<NftResponseData>({
  errorLabel: 'nft',
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const nftProperties = data

    const nftData = await getNftDataServer(nftProperties)
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

const MAX_AGE = 60 * 60 // 1 hour
function getNftCacheKey(nftProperties: ApiNftParams) {
  return `nft:${nftProperties.chain}_${nftProperties.collectionId}_${nftProperties.nftId}`
}

export async function getNftDataServer(
  nftProperties: ApiNftParams
): Promise<NftData | null> {
  const chain = chainMapper[nftProperties.chain]

  if (!chain) return null

  const cacheKey = getNftCacheKey(nftProperties)
  const cachedData = await redisCallWrapper((redis) => redis?.get(cacheKey))
  if (cachedData) {
    return JSON.parse(cachedData) as NftData
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
      let image = externalData?.image as string | undefined
      // manually fix wrong image url for some nfts
      if (image) {
        image = image.replace('/ipfs/ipfs', '/ipfs')
      }

      nftData = {
        name: nftName ?? collectionName ?? '',
        image: image ?? '',
        collectionName: collectionName ?? '',
        price: 0,
      }
      isMetadataRecognizedAsValid = !!image
    }

    if (isMetadataRecognizedAsValid) {
      redisCallWrapper((redis) =>
        redis?.set(cacheKey, JSON.stringify(nftData), 'EX', MAX_AGE)
      )
    }

    return nftData
  } catch (e) {
    console.error('Fail to get nft data for nft:', cacheKey, e)
    return null
  }
}
