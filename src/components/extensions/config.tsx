import { PostContentExtension } from '@subsocial/api/types'
import DonateMessagePreview from './donate/DonateMessagePreview'
import DonateRepliedMessagePreviewPart from './donate/DonateRepliedMessagePreviewPart'
import NftChatItem from './nft/NftChatItem'
import NftRepliedMessagePreviewPart from './nft/NftRepliedMessagePreviewPart'
import {
  ChatItemWithExtensionProps,
  RepliedMessagePreviewPartsProps,
} from './types'

export const repliedMessagePreviewParts: Record<
  PostContentExtension['id'],
  RepliedMessagePreviewPartsProps
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

export const chatItemByExtensionId: Record<
  PostContentExtension['id'],
  (props: ChatItemWithExtensionProps) => JSX.Element
> = {
  'subsocial-donations': DonateMessagePreview,
  'subsocial-evm-nft': NftChatItem,
}
