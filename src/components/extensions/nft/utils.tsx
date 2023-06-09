import { NftProperties } from '@subsocial/api/types'

export const nftChains = [
  'ethereum',
  'polygon',
  'arbitrum',
  'avalanche',
  'bsc',
  'optimism',
] as const

const marketplaceParser: {
  marketplaceName: string
  checker: (link: string) => boolean
  chainMapper: Record<(typeof nftChains)[number], string>
  parser: (link: string) => NftProperties
}[] = [
  {
    marketplaceName: 'opensea',
    checker: (link: string) => link.includes('opensea.io/assets/'),
    chainMapper: {
      ethereum: 'ethereum',
      polygon: 'matic',
      arbitrum: 'arbitrum',
      avalanche: 'avalanche',
      bsc: 'bsc',
      optimism: 'optimism',
    },
    parser: (link: string) => {
      const linkParts = link.split('opensea.io/assets/')
      const [chain, collectionId, nftId] = linkParts[1].split('/')

      return {
        chain,
        nftId,
        collectionId: collectionId,
        url: link,
      }
    },
  },
]

export function parseNftMarketplaceLink(link: string): NftProperties {
  const marketplace = marketplaceParser.find((m) => m.checker(link))

  if (!marketplace) {
    throw new Error('NFT marketplace not found')
  }

  const removedQueryParams = link.split('?')[0]
  const parsed = marketplace.parser(removedQueryParams)
  let mappedChain = ''
  Object.entries(marketplace.chainMapper).forEach(
    ([chain, chainFromMarketplace]) => {
      if (parsed.chain === chainFromMarketplace) {
        mappedChain = chain
      }
    }
  )

  if (!mappedChain) {
    throw new Error(`${parsed.chain} chain is not supported yet.`)
  }

  parsed.chain = mappedChain
  return parsed
}
