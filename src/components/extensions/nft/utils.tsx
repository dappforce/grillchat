import { NftProperties } from '@subsocial/api/types'

export const nftChains = [
  'ethereum',
  'polygon',
  'arbitrum',
  'avalanche',
  'bsc',
  'optimism',
  'fantom',
] as const

const marketplaceParser: {
  marketplaceName: string
  checker: (link: string) => boolean
  chainMapper: Record<string, (typeof nftChains)[number]>
  parser: (link: string) => NftProperties
}[] = [
  {
    marketplaceName: 'opensea',
    checker: (link: string) => link.includes('opensea.io/assets/'),
    chainMapper: {
      ethereum: 'ethereum',
      matic: 'polygon',
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
  {
    marketplaceName: 'rarible',
    chainMapper: {
      ethereum: 'ethereum',
      polygon: 'polygon',
    },
    checker: (link: string) => link.includes('rarible.com/token/'),
    parser: (link: string) => {
      const linkParts = link.split('rarible.com/token/')
      let [chain, tokenInfo] = linkParts[1].split('/')

      if (!tokenInfo) {
        tokenInfo = chain
        chain = 'ethereum'
      }
      const [collectionId, nftId] = tokenInfo.split(':')

      return {
        chain,
        nftId,
        collectionId: collectionId,
        url: link,
      }
    },
  },
  {
    marketplaceName: 'blur',
    chainMapper: {
      ethereum: 'ethereum',
    },
    checker: (link: string) => link.includes('blur.io/asset/'),
    parser: (link: string) => {
      const linkParts = link.split('blur.io/asset/')
      const [collectionId, nftId] = linkParts[1].split('/')

      return {
        chain: 'ethereum',
        nftId,
        collectionId: collectionId,
        url: link,
      }
    },
  },
  {
    marketplaceName: 'x2y2',
    chainMapper: {
      eth: 'ethereum',
    },
    checker: (link: string) => link.includes('x2y2.io/'),
    parser: (link: string) => {
      const linkParts = link.split('x2y2.io/')
      const [chain, collectionId, nftId] = linkParts[1].split('/')

      return {
        chain,
        nftId,
        collectionId: collectionId,
        url: link,
      }
    },
  },
  {
    marketplaceName: 'looksRare',
    chainMapper: {
      ethereum: 'ethereum',
    },
    checker: (link: string) => link.includes('looksrare.org/'),
    parser: (link: string) => {
      const linkParts = link.split('looksrare.com/collections/')
      const [collectionId, nftId] = linkParts[1].split('/')

      return {
        chain: 'ethereum',
        nftId,
        collectionId: collectionId,
        url: link,
      }
    },
  },
  {
    marketplaceName: 'tofunft',
    chainMapper: {
      eth: 'ethereum',
      bsc: 'bsc',
      arbi: 'arbitrum',
      polygon: 'polygon',
      avax: 'avalanche',
      optimism: 'optimism',
      ftm: 'fantom',
    },
    checker: (link: string) => link.includes('tofunft.com/nft'),
    parser: (link: string) => {
      const linkParts = link.split('tofunft.com/nft/')
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
  let mappedChain = marketplace.chainMapper[parsed.chain]

  if (!mappedChain) {
    throw new Error(`${parsed.chain} chain is not supported yet.`)
  }

  parsed.chain = mappedChain
  return parsed
}
