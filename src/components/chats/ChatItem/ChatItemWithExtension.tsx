import { ExtensionChatItemProps } from '@/components/extensions/CommonChatItem'
import DonateMessagePreview from '@/components/extensions/donate/DonateMessagePreview'
import NftChatItem from '@/components/extensions/nft/NftChatItem'

export type ChatItemWithExtensionProps = ExtensionChatItemProps

const ChatItemByExtensionId: Record<
  string,
  (props: ChatItemWithExtensionProps) => JSX.Element
> = {
  'subsocial-donations': DonateMessagePreview,
  'subsocial-evm-nft': NftChatItem,
}

export default function ChatItemWithExtension(
  props: ChatItemWithExtensionProps
) {
  const extensionId = props.message.content?.extensions?.[0].id as string

  const ChatItem = ChatItemByExtensionId[extensionId]

  return <ChatItem {...props} />
}
