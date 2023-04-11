import { getPostQuery } from '@/services/api/query'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { generateRandomColor } from '@/utils/random-colors'
import { truncateText } from '@/utils/text'
import { ComponentProps } from 'react'
import { getChatItemId } from './common'

export type RepliedMessagePreviewProps = ComponentProps<'div'> & {
  repliedMessageId: string
  originalMessage: string
}

const MINIMUM_REPLY_CHAR = 20
export default function RepliedMessagePreview({
  repliedMessageId,
  originalMessage,
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

  const onRepliedMessageClick = () => {
    const id = getChatItemId(repliedMessageId)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div
      {...props}
      className={cx(
        'flex cursor-pointer flex-col overflow-hidden border-l-2 pl-2 text-sm',
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
