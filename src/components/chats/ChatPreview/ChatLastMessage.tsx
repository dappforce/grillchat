import { useMessagesCount } from '@/components/chats/hooks/useMessagesCount'
import { getExtensionConfig } from '@/components/extensions/config'
import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import { cx } from '@/utils/class-names'
import { PostContentExtension } from '@subsocial/api/types'
import { ComponentProps } from 'react'
import useLastMessage from './hooks/useLastMessage'

export type ChatLastMessageProps = ComponentProps<'div'> & {
  hubId: string
  chatId: string
  defaultDesc: string
}

export default function ChatLastMessage({
  hubId,
  chatId,
  defaultDesc,
  ...props
}: ChatLastMessageProps) {
  const { data: lastMessage } = useLastMessage(chatId)
  const messagesCount = useMessagesCount(chatId)

  const isMessageBlockedInCurrentHub = useIsMessageBlocked(
    hubId,
    lastMessage,
    chatId
  )
  const isMessageBlockedInOriginalHub = useIsMessageBlocked(
    lastMessage?.struct.spaceId ?? '',
    lastMessage,
    chatId
  )
  const isMessageBlocked =
    isMessageBlockedInCurrentHub || isMessageBlockedInOriginalHub

  const defaultDescOrMessageCount = defaultDesc || `${messagesCount} messages`

  const extensions = lastMessage?.content?.extensions

  const firstExtension = extensions?.[0]
  const extensionId = firstExtension?.id as PostContentExtension['id']

  const { element, config } =
    getExtensionConfig(extensionId || '')?.replyMessageUI || {}
  const { emptyBodyText, previewClassName } = config || {}

  const ExtensionElement = element

  const lastMessageContent =
    lastMessage?.content?.body ||
    (extensionId ? emptyBodyText || '' : defaultDesc)

  const showedText = isMessageBlocked
    ? defaultDescOrMessageCount
    : lastMessageContent

  return (
    <div
      {...props}
      className={cx(
        'flex items-center gap-1.5 overflow-hidden text-sm text-text-muted',
        props.className
      )}
    >
      {!isMessageBlocked && ExtensionElement && (
        <ExtensionElement
          extensions={extensions}
          className={cx('flex-shrink-0', previewClassName)}
        />
      )}
      <span className='overflow-hidden overflow-ellipsis whitespace-nowrap'>
        {showedText}
      </span>
    </div>
  )
}
