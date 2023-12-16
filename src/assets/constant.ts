import {
  HeartOutline,
  HomeOutline,
  ShortsOutline,
  StarOutline,
} from '@/components/common/Icons'

export const fakeArray = [1, 2, 3, 4, 5, 6]
export const fakeArray_2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export const LIVEPEER_KEY = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY
export const PINATA_PROJECT_ID = process.env.NEXT_PUBLIC_PINATA_PROJECT_ID
export const PINATA_APP_SECRET = process.env.NEXT_PUBLIC_PINATA_APP_SECRET
export const IPFS_GATEWAY = 'https://ipfs.subsocial.network/ipfs/'
export const IPFS_GATEWAY2 = 'https://ipfs.crossbell.io/ipfs/'

export const sidebarNav = [
  {
    title: 'Home',
    icon: HomeOutline,
    to: '/',
  },
  {
    title: 'Shorts',
    icon: ShortsOutline,
    to: '/shorts',
  },
  {
    title: 'Following',
    icon: HeartOutline,
    to: '/feed',
  },
]

export const categories = [
  {
    title: 'Featured',
    icon: StarOutline,
    to: '/',
  },
  {
    title: 'Shorts',
    icon: StarOutline,
    to: '/shorts',
  },
  {
    title: 'Following',
    icon: HeartOutline,
    to: '/feed',
  },
]
