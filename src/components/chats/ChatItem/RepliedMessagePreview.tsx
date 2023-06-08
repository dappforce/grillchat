import Name from '@/components/Name'
import useRandomColor from '@/hooks/useRandomColor'
import { getPostQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import { truncateText } from '@/utils/strings'
import { useTheme } from 'next-themes'
import { ComponentProps, useState } from 'react'

export type RepliedMessagePreviewProps = ComponentProps<'div'> & {
  repliedMessageId: string
  originalMessage: string
  minimumReplyChar?: number
  scrollToMessage?: (messageId: string) => Promise<void>
  replyToExtension?: boolean
}

const MINIMUM_REPLY_CHAR = 35
export default function RepliedMessagePreview({
  repliedMessageId,
  originalMessage,
  scrollToMessage,
  minimumReplyChar = MINIMUM_REPLY_CHAR,
  replyToExtension = false,
  ...props
}: RepliedMessagePreviewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data } = getPostQuery.useQuery(repliedMessageId)
  const replySender = data?.struct.ownerId
  const replySenderColor = useRandomColor(replySender)
  const { theme } = useTheme()
  console.log(theme)
  if (!data) {
    return null
  }

  let showedText = data.content?.body ?? ''

  const { id, properties } = data.content?.extersions?.[0] || {}
  if (originalMessage.length < minimumReplyChar) {
    showedText = truncateText(showedText, minimumReplyChar)
  }

  const onRepliedMessageClick = async () => {
    if (!scrollToMessage) return
    setIsLoading(true)
    await scrollToMessage(repliedMessageId)
    setIsLoading(false)
  }

  const { amount, token } = properties || {}

  const donateRepliedPreview =
    id === 'subsocial-donations' ? (
      <div
        className={cx(
          'bg-gradient-to-br from-[#C43333] to-[#F9A11E]',
          'rounded-2xl px-3 py-[0.15rem] text-white'
        )}
      >
        {amount} {token}
      </div>
    ) : null

  console.log(theme === 'light', id === 'subsocial-donations')

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
      <Name
        ownerId={data?.struct.ownerId}
        senderColor={replySenderColor}
        className='font-medium'
      />
      <div
        className={cx('flex items-center gap-2', {
          ['text-white']: theme === 'light' && replyToExtension,
        })}
      >
        {donateRepliedPreview}
        <span
          className={cx(
            'overflow-hidden overflow-ellipsis whitespace-nowrap opacity-75',
            {
              ['text-white']: theme === 'light' && replyToExtension,
            }
          )}
        >
          {showedText}
        </span>
      </div>
    </div>
  )
}
