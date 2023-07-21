import { getUrlFromText } from '@/utils/strings'
import { NftProperties } from '@subsocial/api/types'

const evmChains = [
  'ethereum',
  'moonbeam',
  'astar',
  'polygon',
  'arbitrum',
  'optimism',
  'avalanche',
  'bsc',
  'fantom',
]

const substrateChains = ['statemine', 'basilisk', 'rmrk', 'kusama']

export const nftChains = [...evmChains, ...substrateChains]

const marketplaceParser: {
  name: string
  link: string
  checker: (link: string) => boolean
  chainMapper: Record<string, (typeof nftChains)[number]>
  parser: (link: string) => NftProperties
}[] = [
  {
    name: 'OpenSea.io',
    link: 'https://opensea.io',
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
    name: 'Rarible.com',
    link: 'https://rarible.com',
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
    name: 'Blur.io',
    link: 'https://blur.io',
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
    name: 'x2y2.io',
    link: 'https://x2y2.io',
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
    name: 'LooksRare.org',
    link: 'https://looksrare.org',
    chainMapper: {
      ethereum: 'ethereum',
    },
    checker: (link: string) => link.includes('looksrare.org/'),
    parser: (link: string) => {
      const linkParts = link.split('looksrare.org/collections/')
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
    name: 'TofuNFT.com',
    link: 'https://tofunft.com',
    chainMapper: {
      eth: 'ethereum',
      bsc: 'bsc',
      arbi: 'arbitrum',
      polygon: 'polygon',
      avax: 'avalanche',
      optimism: 'optimism',
      ftm: 'fantom',
      moonbeam: 'moonbeam',
      astar: 'astar',
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
  {
    name: 'Singular.app',
    link: 'https://singular.app',
    chainMapper: {
      statemine: 'statemine',
      moonbeam: 'moonbeam',
      kusama: 'kusama',
    },
    checker: (link: string) => link.includes('singular.app'),
    parser: (link: string) => {
      const linkParts = link.split('singular.app/collectibles/')
      let [chain, collectionId, nftId] = linkParts[1].split('/')

      if (chain === 'statemine') {
        collectionId = `u-${collectionId}`
        nftId = `${collectionId}-${nftId}`
      }

      return {
        chain,
        nftId,
        collectionId,
        url: link,
      }
    },
  },
  {
    name: 'Kodadot.xyz',
    link: 'https://kodadot.xyz',
    chainMapper: {
      stmn: 'statemine',
      rmrk: 'rmrk',
      bsx: 'basilisk',
      ksm: 'kusama',
    },
    checker: (link: string) => link.includes('kodadot.xyz'),
    parser: (link: string) => {
      const linkParts = link.split('kodadot.xyz/')
      const [chain, _, nftId] = linkParts[1].split('/')
      const collectionId = nftId.split('-').slice(0, -1).join('-')

      return {
        chain,
        nftId,
        collectionId: collectionId,
        url: link,
      }
    },
  },
]

const marketplacesInfo = marketplaceParser.map((m) => ({
  name: m.name,
  link: m.link,
}))
export function getSupportedMarketplaces() {
  return marketplacesInfo
}

export function getMarketplaceFromLink(link: string) {
  return marketplaceParser.find((m) => m.checker(link))
}

export function parseNftMarketplaceLink(link: string): NftProperties {
  const url = getUrlFromText(link)
  if (!url) {
    throw new Error('Invalid URL')
  }

  const marketplace = marketplaceParser.find((m) => m.checker(url))

  if (!marketplace) {
    throw new Error('NFT marketplace not found')
  }

  const removedQueryParams = url.split('?')[0]
  const parsed = marketplace.parser(removedQueryParams)

  let mappedChain = marketplace.chainMapper[parsed.chain]

  if (!mappedChain) {
    throw new Error(`${parsed.chain} chain is not supported yet.`)
  }

  parsed.chain = mappedChain
  return parsed
}
