import { getExtensionConfig } from '@/components/extensions/config'
import Name from '@/components/Name'
import useRandomColor from '@/hooks/useRandomColor'
import { getPostQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import { truncateText } from '@/utils/strings'
import { ComponentProps, useState } from 'react'

export type RepliedMessagePreviewProps = ComponentProps<'div'> & {
  repliedMessageId: string
  originalMessage: string
  minimumReplyChar?: number
  scrollToMessage?: (messageId: string) => Promise<void>
  replyToExtension?: boolean
  textColor?: string
}

const MINIMUM_REPLY_CHAR = 35
export default function RepliedMessagePreview({
  repliedMessageId,
  originalMessage,
  scrollToMessage,
  minimumReplyChar = MINIMUM_REPLY_CHAR,
  replyToExtension = false,
  textColor,
  ...props
}: RepliedMessagePreviewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: message } = getPostQuery.useQuery(repliedMessageId)
  const replySender = message?.struct.ownerId ?? ''
  const replySenderColor = useRandomColor(replySender)

  const extensions = message?.content?.extensions

  const messageContent = message?.content?.body

  if (!message) {
    return null
  }

  const extensionId = extensions?.[0]?.id

  const extensionRepliedPart = getExtensionConfig(
    extensionId ?? ''
  )?.replyMessageUI

  const { element: ExtensionElement, config } = extensionRepliedPart || {}
  const { place, emptyBodyText } = config || {}

  const extensionPart = ExtensionElement && (
    <ExtensionElement message={message} extensions={extensions} />
  )

  let showedText = messageContent ?? ''
  if (originalMessage.length < minimumReplyChar) {
    showedText = truncateText(showedText, minimumReplyChar)
  }

  const onRepliedMessageClick = async () => {
    if (!scrollToMessage) return
    setIsLoading(true)
    await scrollToMessage(repliedMessageId)
    setIsLoading(false)
  }

  const bodyText = (
    <span className='overflow-hidden overflow-ellipsis whitespace-nowrap opacity-75'>
      {showedText || emptyBodyText}
    </span>
  )

  return (
    <div
      {...props}
      className={cx(
        'flex items-center gap-2 overflow-hidden border-l-2 pl-2 text-sm',
        scrollToMessage && 'cursor-pointer',
        isLoading && 'animate-pulse',
        props.className
      )}
      style={{ borderColor: textColor || replySenderColor, ...props.style }}
      onClick={(e) => {
        e.stopPropagation()
        onRepliedMessageClick()
        props.onClick?.(e)
      }}
    >
      {place === 'inside' && extensionPart}
      <div className='flex flex-col overflow-hidden'>
        <Name
          address={message?.struct.ownerId}
          className='mb-1 font-medium'
          color={textColor}
        />
        {place === 'body' && extensionPart ? (
          <div className={cx('flex items-center gap-2')}>
            {extensionPart}
            {bodyText}
          </div>
        ) : (
          bodyText
        )}
      </div>
    </div>
  )
}
