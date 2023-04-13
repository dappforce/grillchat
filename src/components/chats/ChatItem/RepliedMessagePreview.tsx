import { getPostQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import { generateRandomColor } from '@/utils/random-colors'
import { generateRandomName } from '@/utils/random-name'
import { truncateText } from '@/utils/text'
import { ComponentProps, RefObject, useState } from 'react'
import { scrollToChatItem } from '../helpers'

export type RepliedMessagePreviewProps = ComponentProps<'div'> & {
  repliedMessageId: string
  originalMessage: string
  scrollContainer?: RefObject<HTMLElement | null>
  getRepliedElement?: (commentId: string) => Promise<HTMLElement | null>
}

const MINIMUM_REPLY_CHAR = 20
export default function RepliedMessagePreview({
  repliedMessageId,
  originalMessage,
  scrollContainer,
  getRepliedElement,
  ...props
}: RepliedMessagePreviewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data } = getPostQuery.useQuery(repliedMessageId)
  if (!data) {
    return null
  }

  const replySender = data.struct.ownerId
  const replySenderColor = generateRandomColor(replySender)

  let showedText = data.content?.body ?? ''
  if (originalMessage.length < MINIMUM_REPLY_CHAR) {
    showedText = truncateText(showedText, MINIMUM_REPLY_CHAR)
  }

  const onRepliedMessageClick = async () => {
    if (!getRepliedElement) return
    setIsLoading(true)
    const element = await getRepliedElement(repliedMessageId)
    setIsLoading(false)
    scrollToChatItem(element, scrollContainer?.current ?? null)
  }

  const name = generateRandomName(data?.struct.ownerId ?? '')

  return (
    <div
      {...props}
      className={cx(
        'flex flex-col overflow-hidden border-l-2 pl-2 text-sm',
        getRepliedElement && 'cursor-pointer',
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
