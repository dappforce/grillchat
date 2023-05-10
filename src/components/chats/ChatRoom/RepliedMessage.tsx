import Button from '@/components/Button'
import useRandomColor from '@/hooks/useRandomColor'
import { getPostQuery } from '@/services/api/query'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps } from 'react'
import { BsFillReplyFill } from 'react-icons/bs'
import { HiXMark } from 'react-icons/hi2'
import { getMessageElementId, scrollToMessageElement } from '../helpers'

export type RepliedMessageProps = ComponentProps<'div'> & {
  replyMessageId: string
  closeReply: () => void
  scrollContainer?: React.RefObject<HTMLElement | null>
}

export default function RepliedMessage({
  replyMessageId,
  closeReply,
  scrollContainer,
}: RepliedMessageProps) {
  const { data: message } = getPostQuery.useQuery(replyMessageId)
  const messageContent = message?.content?.body
  const messageSenderAddr = message?.struct.ownerId
  const senderColor = useRandomColor(messageSenderAddr)
  const name = generateRandomName(messageSenderAddr)

  const onRepliedMessageClick = () => {
    const element = document.getElementById(getMessageElementId(replyMessageId))
    scrollToMessageElement(element, scrollContainer?.current ?? null)
  }

  return (
    <div
      className='flex cursor-pointer items-center overflow-hidden border-t border-border-gray pb-3 pt-2'
      onClick={onRepliedMessageClick}
    >
      <div className='flex-shrink-0 pl-2 pr-3 text-text-muted'>
        <BsFillReplyFill className='text-2xl' />
      </div>
      <div
        style={{ borderColor: senderColor }}
        className='flex flex-1 flex-col items-start gap-0.5 overflow-hidden border-l-2 pl-2 text-sm'
      >
        <span className='font-medium' style={{ color: senderColor }}>
          Reply to {name}
        </span>
        <span className='w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-light opacity-75'>
          {messageContent}
        </span>
      </div>
      <Button
        size='noPadding'
        className='mx-3 flex-shrink-0'
        variant='transparent'
        onClick={(e) => {
          e.stopPropagation()
          closeReply()
        }}
      >
        <HiXMark className='text-2xl' />
      </Button>
    </div>
  )
}
