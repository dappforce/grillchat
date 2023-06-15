import { PostContent, PostData } from '@subsocial/api/types'
import DonateRepliedMessagePreviewPart from './donate/DonateRepliedMessagePreviewPart'
import NftRepliedMessagePreviewPart from './nft/NftRepliedMessagePreviewPart'

export type RepliedMessagePreviewPartProps = {
  extensions: PostContent['extensions']
  message?: PostData | null
  className?: string
}

type RepliedMessageConfig = {
  place: 'inside' | 'body'
  emptyBodyText?: string
  textColor?: string
  previewClassName?: string
}

type RepliedMessagePreviewPatrsProps = {
  element: (props: RepliedMessagePreviewPartProps) => JSX.Element | null
  config: RepliedMessageConfig
}

export const repliedMessagePreviewPatrs: Record<
  string,
  RepliedMessagePreviewPatrsProps
> = {
  'subsocial-evm-nft': {
    element: NftRepliedMessagePreviewPart,
    config: { place: 'inside', emptyBodyText: 'NFT', previewClassName: 'w-4' },
  },
  'subsocial-donations': {
    element: DonateRepliedMessagePreviewPart,
    config: { place: 'body', textColor: '#FCEEE2' },
  },
}
