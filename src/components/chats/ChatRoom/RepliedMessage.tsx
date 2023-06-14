import Button from '@/components/Button'
import ImageLoader from '@/components/ImageLoader'
import Name from '@/components/Name'
import useRandomColor from '@/hooks/useRandomColor'
import { getPostQuery } from '@/services/api/query'
import { getNftDataQuery } from '@/services/external/query'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { BsFillReplyFill } from 'react-icons/bs'
import { HiXMark } from 'react-icons/hi2'
import { getMessageElementId, scrollToMessageElement } from '../utils'

export type RepliedMessageProps = ComponentProps<'div'> & {
  replyMessageId: string
  scrollContainer?: React.RefObject<HTMLElement | null>
}

export default function RepliedMessage({
  replyMessageId,
  scrollContainer,
}: RepliedMessageProps) {
  const clearReplyTo = useMessageData((state) => state.clearReplyTo)

  const { data: message } = getPostQuery.useQuery(replyMessageId)
  const messageSenderAddr = message?.struct.ownerId
  const senderColor = useRandomColor(messageSenderAddr)

  const onRepliedMessageClick = () => {
    const element = document.getElementById(getMessageElementId(replyMessageId))
    scrollToMessageElement(element, scrollContainer?.current ?? null)
  }

  // TODO: extract to better flexibility for other extensions
  const extensions = message?.content?.extensions
  const firstExtension = extensions?.[0]
  const hasNftExtension =
    firstExtension && firstExtension.id === 'subsocial-evm-nft'

  const messageContent =
    message?.content?.body || (hasNftExtension ? 'NFT' : '')

  const { data: nftData } = getNftDataQuery.useQuery(
    firstExtension?.properties ?? null
  )

  return (
    <div
      className='flex cursor-pointer items-center overflow-hidden border-t border-border-gray pb-3 pt-2'
      onClick={onRepliedMessageClick}
    >
      <div className='flex-shrink-0 pl-2 pr-3 text-text-muted'>
        <BsFillReplyFill className='text-2xl' />
      </div>
      <div className='flex flex-1 items-center gap-2 overflow-hidden border-l-2 pl-2'>
        {hasNftExtension && (
          <ImageLoader
            containerClassName={cx('rounded-md overflow-hidden flex-shrink-0')}
            className={cx('aspect-square w-10')}
            placeholderClassName={cx('w-10 aspect-square')}
            image={nftData?.image}
          />
        )}
        <div
          style={{ borderColor: senderColor }}
          className='flex flex-1 flex-col items-start gap-0.5 text-sm'
        >
          <Name
            address={messageSenderAddr || ''}
            additionalText='Reply to'
            className='font-medium'
          />
          <span className='w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-light opacity-75'>
            {messageContent}
          </span>
        </div>
      </div>
      <Button
        size='noPadding'
        className='mx-3 flex-shrink-0'
        variant='transparent'
        onClick={(e) => {
          e.stopPropagation()
          clearReplyTo()
        }}
      >
        <HiXMark className='text-2xl' />
      </Button>
    </div>
  )
}
