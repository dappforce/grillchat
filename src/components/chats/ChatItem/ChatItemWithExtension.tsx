import { getExtensionConfig } from '@/components/extensions/config'
import { ExtensionChatItemProps } from '@/components/extensions/types'
import { PostContentExtension } from '@subsocial/api/types'

export default function ChatItemWithExtension(props: ExtensionChatItemProps) {
  const extensionId = props.message.content?.extensions?.[0]
    .id as PostContentExtension['id']

  const ChatItem = getExtensionConfig(extensionId)?.chatItemComponent
  if (!ChatItem) return null

  return <ChatItem {...props} />
}
