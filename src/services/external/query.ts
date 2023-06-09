import { createQuery } from '@/subsocial-query'
import { EvmChain } from '@moralisweb3/common-evm-utils'
import { NftProperties } from '@subsocial/api/types'
import axios from 'axios'
import { getMoralisApi } from './utils'

const moralisChainMapper: Record<string, EvmChain> = {
  ethereum: EvmChain.ETHEREUM,
  polygon: EvmChain.POLYGON,
}

async function getNftData(nft: NftProperties | null) {
  if (!nft) return null

  const moralis = await getMoralisApi()
  const response = await moralis?.EvmApi.nft.getNFTMetadata({
    address: nft.collectionId,
    tokenId: nft.nftId,
    chain: moralisChainMapper[nft.chain],
    normalizeMetadata: true,
  })
  const metadata = response?.raw.normalized_metadata

  return {
    name: metadata?.name,
    image: metadata?.image,
    collectionName: response?.raw.name,
    price: 0,
  }
}

export const getNftDataQuery = createQuery({
  key: 'getNftData',
  fetcher: getNftData,
})

async function getNftPrice(nft: NftProperties | null) {
  if (!nft) return 'Not found'

  const apiUrl = `https://api.opensea.io/v2/orders/${nft.chain}/seaport/listings?asset_contract_address=${nft.collectionId}&limit=1&token_ids=${nft.nftId}&order_by=eth_price&order_direction=asc`
  const response = await axios.get(apiUrl, {
    headers: {
      'X-API-KEY': '207875fb75e042ee8b313d83aad47f34',
    },
  })

  const [order] = response.data?.orders ?? []
  const price = order?.current_price

  if (!price) {
    return 'Not for sale'
  }

  const takerAsset = order?.taker_asset_bundle?.assets[0]
  const assetContract = takerAsset?.asset_contract

  const symbol = assetContract?.symbol || '~'
  const decimals = takerAsset?.decimals || 18

  const { BigNumber } = await import('bignumber.js')
  const parsedPrice = new BigNumber(price)
    .div(new BigNumber(10).pow(new BigNumber(decimals)))
    .toString()

  return `${parsedPrice} ${symbol}`
}

export const getNftPriceQuery = createQuery({
  key: 'getNftPrice',
  fetcher: getNftPrice,
})
