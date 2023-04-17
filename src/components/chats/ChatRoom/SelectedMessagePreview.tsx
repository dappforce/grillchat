import Button from '@/components/Button'
import { getPostQuery } from '@/services/api/query'
import { SelectedMessage } from '@/services/subsocial/commentIds'
import { generateRandomColor } from '@/utils/random-colors'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps } from 'react'
import { BsFillReplyFill } from 'react-icons/bs'
import { HiPencil, HiXMark } from 'react-icons/hi2'
import { getChatItemId, scrollToChatItem } from '../helpers'

export type RepliedMessageProps = ComponentProps<'div'> & {
  selectedMessage: SelectedMessage
  closeReply: () => void
  scrollContainer?: React.RefObject<HTMLElement | null>
}

export default function RepliedMessage({
  selectedMessage,
  closeReply,
  scrollContainer,
}: RepliedMessageProps) {
  const { data } = getPostQuery.useQuery(selectedMessage.id)
  const chatContent = data?.content?.body
  const chatSenderAddr = data?.struct.ownerId
  const senderColor = generateRandomColor(chatSenderAddr)
  const name = generateRandomName(chatSenderAddr)

  const onRepliedMessageClick = () => {
    const element = document.getElementById(getChatItemId(selectedMessage.id))
    scrollToChatItem(element, scrollContainer?.current ?? null)
  }

  const Icon = selectedMessage.type === 'reply' ? BsFillReplyFill : HiPencil
  const text =
    selectedMessage.type === 'reply' ? `Reply to ${name}` : 'Editing message'

  return (
    <div
      className='flex cursor-pointer items-center overflow-hidden border-t border-border-gray pb-3 pt-2'
      onClick={onRepliedMessageClick}
    >
      <div className='flex-shrink-0 pl-2 pr-3 text-2xl text-text-muted'>
        <Icon />
      </div>
      <div
        style={{ borderColor: senderColor }}
        className='flex flex-1 flex-col items-start gap-0.5 overflow-hidden border-l-2 pl-2 text-sm'
      >
        <span className='font-medium' style={{ color: senderColor }}>
          {text}
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
