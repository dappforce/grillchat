import { ExtensionChatItemProps } from '@/components/extensions/CommonChatItem'
import { chatItemByExtensionId } from '@/components/extensions/config'

export type ChatItemWithExtensionProps = ExtensionChatItemProps

export default function ChatItemWithExtension(
  props: ChatItemWithExtensionProps
) {
  const extensionId = props.message.content?.extensions?.[0].id as string

  const ChatItem = chatItemByExtensionId[extensionId]

  return <ChatItem {...props} />
}
