import useRandomColor from '@/hooks/useRandomColor'
import { getPostQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'
import { truncateText } from '@/utils/strings'
import { ComponentProps, useState } from 'react'

export type RepliedMessagePreviewProps = ComponentProps<'div'> & {
  repliedMessageId: string
  originalMessage: string
  minimumReplyChar?: number
  scrollToMessage?: (messageId: string) => Promise<void>
}

const MINIMUM_REPLY_CHAR = 35
export default function RepliedMessagePreview({
  repliedMessageId,
  originalMessage,
  scrollToMessage,
  minimumReplyChar = MINIMUM_REPLY_CHAR,
  ...props
}: RepliedMessagePreviewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data } = getPostQuery.useQuery(repliedMessageId)
  const replySender = data?.struct.ownerId
  const replySenderColor = useRandomColor(replySender)

  if (!data) {
    return null
  }

  let showedText = data.content?.body ?? ''
  if (originalMessage.length < minimumReplyChar) {
    showedText = truncateText(showedText, minimumReplyChar)
  }

  const onRepliedMessageClick = async () => {
    if (!scrollToMessage) return
    setIsLoading(true)
    await scrollToMessage(repliedMessageId)
    setIsLoading(false)
  }

  const name = generateRandomName(data?.struct.ownerId)

  return (
    <div
      {...props}
      className={cx(
        'flex flex-col overflow-hidden border-l-2 pl-2 text-sm',
        scrollToMessage && 'cursor-pointer',
        isLoading && 'animate-pulse',
        props.className
      )}
      style={{ borderColor: replySenderColor, ...props.style }}
      onClick={(e) => {
        e.stopPropagation()
        onRepliedMessageClick()
        props.onClick?.(e)
      }}
    >
      <span style={{ color: replySenderColor }}>{name}</span>
      <span className='overflow-hidden overflow-ellipsis whitespace-nowrap opacity-75'>
        {showedText}
      </span>
    </div>
  )
}
