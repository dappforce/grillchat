import Button from '@/components/Button'
import { getPostQuery } from '@/services/api/query'
import { generateRandomColor } from '@/utils/random-colors'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps } from 'react'
import { BsFillReplyFill } from 'react-icons/bs'
import { HiXMark } from 'react-icons/hi2'
import { getChatItemId, scrollToChatItem } from '../helpers'

export type RepliedMessageProps = ComponentProps<'div'> & {
  replyChatId: string
  closeReply: () => void
  scrollContainer?: React.RefObject<HTMLElement | null>
}

export default function RepliedMessage({
  replyChatId,
  closeReply,
  scrollContainer,
}: RepliedMessageProps) {
  const { data } = getPostQuery.useQuery(replyChatId)
  const chatContent = data?.content?.body
  const chatSenderAddr = data?.struct.ownerId
  const senderColor = generateRandomColor(chatSenderAddr ?? '')
  const name = generateRandomName(chatSenderAddr ?? '')

  const onRepliedMessageClick = () => {
    const element = document.getElementById(getChatItemId(replyChatId))
    scrollToChatItem(element, scrollContainer?.current ?? null)
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
          {chatContent}
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
