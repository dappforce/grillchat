import NftImage from '@/components/extensions/nft/NftImage'
import Name from '@/components/Name'
import useRandomColor from '@/hooks/useRandomColor'
import { getPostQuery } from '@/services/api/query'
import { getNftDataQuery } from '@/services/moralis/query'
import { cx } from '@/utils/class-names'
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
  const { data: message } = getPostQuery.useQuery(repliedMessageId)
  const replySender = message?.struct.ownerId
  const replySenderColor = useRandomColor(replySender)

  // TODO: extract to better flexibility for other extensions
  const extensions = message?.content?.extensions
  const firstExtension = extensions?.[0]
  const hasNftExtension =
    firstExtension && firstExtension.id === 'subsocial-evm-nft'

  const messageContent = message?.content?.body || hasNftExtension ? 'NFT' : ''

  const { data: nftData } = getNftDataQuery.useQuery(
    firstExtension?.properties ?? null
  )

  if (!message) {
    return null
  }

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

  return (
    <div
      {...props}
      className={cx(
        'flex gap-2 overflow-hidden border-l-2 pl-2 text-sm',
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
      {hasNftExtension && (
        <NftImage
          containerClassName={cx('rounded-md overflow-hidden')}
          className={cx('aspect-square w-10')}
          placeholderClassName={cx('w-10 aspect-square')}
          image={nftData?.image}
        />
      )}
      <div className='flex flex-col'>
        <Name ownerId={message?.struct.ownerId} className='font-medium' />
        <span className='overflow-hidden overflow-ellipsis whitespace-nowrap opacity-75'>
          {showedText}
        </span>
      </div>
    </div>
  )
}
