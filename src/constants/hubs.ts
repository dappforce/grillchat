import GrillImage from '@/assets/hubs/grill.png'
import NftsImage from '@/assets/hubs/nfts.png'
import PolkadotImage from '@/assets/hubs/polkadot.png'
import { ImageProps } from 'next/image'

export type Hub = {
  title: string
  description: string
  path: string
  image: ImageProps['src']
}

export const HUBS: Hub[] = [
  {
    title: 'Polkadot Ecosystem',
    description: 'Chats for all things Polkadot',
    image: PolkadotImage,
    path: 'polka',
  },
  {
    title: 'NFTs',
    description: 'Discussions for any and every collection',
    image: NftsImage,
    path: 'nft',
  },
  {
    title: 'The Grill',
    description: 'On-chain chat rooms for various topics',
    image: GrillImage,
    path: 'x',
  },
]
