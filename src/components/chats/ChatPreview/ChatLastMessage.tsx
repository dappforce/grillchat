import { getExtensionConfig } from '@/components/extensions/config'
import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
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
  const { data: messageIds } = useCommentIdsByPostId(chatId)

  const { data: lastMessage } = useLastMessage(chatId)
  const isMessageBlocked = useIsMessageBlocked(hubId, lastMessage, chatId)

  const defaultDescOrMessageCount =
    defaultDesc || `${messageIds?.length} messages`

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
        'flex items-center gap-1.5 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-text-muted',
        props.className
      )}
    >
      {ExtensionElement && (
        <ExtensionElement
          extensions={extensions}
          className={cx('flex-shrink-0', previewClassName)}
        />
      )}
      {showedText}
    </div>
  )
}
