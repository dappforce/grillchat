import Container from '@/components/Container'
import { getPostQuery } from '@/services/api/query'
import { RiPushpinLine } from 'react-icons/ri'
import usePinnedMessage from '../hooks/usePinnedMessage'
import useScrollToMessage from './hooks/useScrollToMessage'

type PinnedMessageProps = {
  chatId: string
  asContainer?: boolean
  scrollToMessage: ReturnType<typeof useScrollToMessage>
}
export default function PinnedMessage({
  chatId,
  asContainer,
  scrollToMessage,
}: PinnedMessageProps) {
  const pinnedMessageId = usePinnedMessage(chatId)
  const { data: message } = getPostQuery.useQuery(pinnedMessageId ?? '', {
    enabled: !!pinnedMessageId,
  })
  if (!message) return null

  const Component = asContainer ? Container<'div'> : 'div'
  return (
    <div className='sticky top-0 z-10 border-b border-border-gray bg-background-light text-sm'>
      <Component
        className='flex cursor-pointer items-center gap-4 overflow-hidden py-2'
        onClick={() => scrollToMessage(message.id)}
      >
        <div className='mr-0.5 flex-shrink-0'>
          <RiPushpinLine className='ml-2 text-lg' />
        </div>
        <div className='flex flex-col overflow-hidden'>
          <span className='font-medium text-text-primary'>Pinned Message</span>
          <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
            {message.content?.body}
          </span>
        </div>
      </Component>
    </div>
  )
}
