import { getPostQuery } from '@/services/api/query'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { generateRandomColor } from '@/utils/random-colors'
import { truncateText } from '@/utils/text'
import { waitStopScrolling } from '@/utils/window'
import { ComponentProps, RefObject } from 'react'

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
    const element = await getRepliedElement(repliedMessageId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      await waitStopScrolling(scrollContainer?.current)
      element.classList.add('wiggle')
      element.onanimationend = function () {
        element.classList.remove('wiggle')
      }
    }
  }

  return (
    <div
      {...props}
      className={cx(
        'flex flex-col overflow-hidden border-l-2 pl-2 text-sm',
        getRepliedElement && 'cursor-pointer',
        props.className
      )}
      style={{ borderColor: replySenderColor, ...props.style }}
      onClick={(e) => {
        onRepliedMessageClick()
        props.onClick?.(e)
      }}
    >
      <span style={{ color: replySenderColor }}>
        {truncateAddress(data?.struct.ownerId ?? '')}
      </span>
      <span className='overflow-hidden overflow-ellipsis whitespace-nowrap'>
        {showedText}
      </span>
    </div>
  )
}
