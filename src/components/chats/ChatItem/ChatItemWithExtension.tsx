import { extensionsConfig } from '@/components/extensions/config'
import { ChatItemWithExtensionProps } from '@/components/extensions/types'
import { PostContentExtension } from '@subsocial/api/types'
import DefaultChatItem from './variants/DefaultChatItem'

export default function ChatItemWithExtension(
  props: ChatItemWithExtensionProps
) {
  const extensionId = props.message.content?.extensions?.[0]
    .id as PostContentExtension['id']

  const ChatItem =
    extensionsConfig[extensionId].chatItemComponent || DefaultChatItem

  return <ChatItem {...props} />
}
