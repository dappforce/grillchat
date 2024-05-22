import Farcaster from '@/assets/logo/farcaster.svg'
import { PostData } from '@subsocial/api/types'
import { FaXTwitter } from 'react-icons/fa6'

export function getShareMessageMenus(message: PostData) {
  return [
    { text: 'Farcaster', icon: Farcaster },
    { text: 'Twitter', icon: FaXTwitter },
  ]
}
