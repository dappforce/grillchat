import {
  getExtensionConfig,
  MessageExtensionIds,
} from '@/components/extensions/config'
import { ExtensionChatItemProps } from '@/components/extensions/types'

export default function ChatItemWithExtension(props: ExtensionChatItemProps) {
  const extensionId = props.message.content?.extensions?.[0]
    .id as MessageExtensionIds

  const ChatItemComponent = getExtensionConfig(extensionId)?.chatItemComponent
  if (!ChatItemComponent) return null

  return <ChatItemComponent {...props} />
}
