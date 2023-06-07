import { NftProperties } from '@subsocial/api/types'

export const chains = ['ethereum', 'polygon'] as const

const marketplaceParser: {
  marketplaceName: string
  checker: (link: string) => boolean
  parser: (link: string) => NftProperties
}[] = [
  {
    marketplaceName: 'opensea',
    checker: (link: string) => link.includes('opensea.io/assets/'),
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

  return marketplace.parser(link)
}
