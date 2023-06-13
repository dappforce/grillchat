import { ExtensionChatItemProps } from '@/components/extensions/CommonChatItem'
import NftChatItem from '@/components/extensions/nft/NftChatItem'
import DonateMessagePreview from '@/components/modals/donate/DonateMessagePreview'
import { ExtensionId } from '@subsocial/api/types'

export type ChatItemWithExtensionProps = ExtensionChatItemProps

const ChatItemByExtensionId: Record<
  ExtensionId,
  (props: ChatItemWithExtensionProps) => JSX.Element
> = {
  'subsocial-donations': DonateMessagePreview,
  'subsocial-evm-nft': NftChatItem,
}

export default function ChatItemWithExtension(
  props: ChatItemWithExtensionProps
) {
  const extensionId = props.message.content?.extensions?.[0].id as ExtensionId

  const ChatItem = ChatItemByExtensionId[extensionId]

  return <ChatItem {...props} />
}
