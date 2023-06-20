import { ChatItemWithExtensionProps } from '../chats/ChatItem/ChatItemWithExtension'
import DonateMessagePreview from './donate/DonateMessagePreview'
import DonateRepliedMessagePreviewPart from './donate/DonateRepliedMessagePreviewPart'
import NftChatItem from './nft/NftChatItem'
import NftRepliedMessagePreviewPart from './nft/NftRepliedMessagePreviewPart'
import { RepliedMessagePreviewPatrsProps } from './types'

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

export const chatItemByExtensionId: Record<
  string,
  (props: ChatItemWithExtensionProps) => JSX.Element
> = {
  'subsocial-donations': DonateMessagePreview,
  'subsocial-evm-nft': NftChatItem,
}
