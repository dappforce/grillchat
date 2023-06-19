import { ExtensionChatItemProps } from '@/components/extensions/CommonChatItem'
import NftChatItem from '@/components/extensions/nft/NftChatItem'

export type ChatItemWithExtensionProps = ExtensionChatItemProps

export default function ChatItemWithExtension(
  props: ChatItemWithExtensionProps
) {
  return <NftChatItem {...props} />
}
