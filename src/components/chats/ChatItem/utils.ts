import Farcaster from '@/assets/logo/farcaster.svg'
import { MenuListProps } from '@/components/MenuList'
import { env } from '@/env.mjs'
import { useAnalytics } from '@/stores/analytics'
import { getCurrentUrlOrigin } from '@/utils/links'
import {
  farcasterShareUrl,
  openNewWindow,
  twitterShareUrl,
} from '@/utils/social-share'
import { PostData } from '@subsocial/api/types'
import { FaXTwitter } from 'react-icons/fa6'
import urlJoin from 'url-join'

export function getShareMessageMenus(
  message: PostData
): MenuListProps['menus'] {
  const title = 'Check out this message on Epic'
  const urlToShare = urlJoin(
    getCurrentUrlOrigin(),
    env.NEXT_PUBLIC_BASE_PATH,
    `/message/${message.id}`
  )

  return [
    {
      text: 'Farcaster',
      icon: Farcaster,
      onClick: () => {
        openNewWindow(farcasterShareUrl(urlToShare, title))
        useAnalytics.getState().sendEvent('external_share', {
          value: 'farcaster',
          postId: message.id,
        })
      },
    },
    {
      text: 'Twitter',
      icon: FaXTwitter,
      onClick: () => {
        openNewWindow(
          twitterShareUrl(urlToShare, title, { tags: ['Epic', 'Meme2Earn'] })
        )
        useAnalytics
          .getState()
          .sendEvent('external_share', { value: 'twitter', postId: message.id })
      },
    },
  ]
}
