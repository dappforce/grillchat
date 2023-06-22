import { ExtensionChatItemProps } from '@/components/extensions/CommonChatItem'
import { chatItemByExtensionId } from '@/components/extensions/config'
import { PostContentExtension } from '@subsocial/api/types'

export type ChatItemWithExtensionProps = ExtensionChatItemProps

export default function ChatItemWithExtension(
  props: ChatItemWithExtensionProps
) {
  const extensionId = props.message.content?.extensions?.[0]
    .id as PostContentExtension['id']

  const ChatItem = chatItemByExtensionId[extensionId]

  return <ChatItem {...props} />
}
