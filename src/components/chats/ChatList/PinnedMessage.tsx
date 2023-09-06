import PinIcon from '@/assets/icons/pin.png'
import Container from '@/components/Container'
import { getPostExtension } from '@/components/extensions/utils'
import { getPinnedMessageInChatId } from '@/constants/chat'
import { getPostQuery } from '@/services/api/query'
import Image from 'next/image'
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
  const { data: chat } = getPostQuery.useQuery(chatId)
  const pinExtension = getPostExtension(
    chat?.content?.extensions,
    'subsocial-pinned-posts'
  )

  const pinnedMessage =
    getPinnedMessageInChatId(chatId) || pinExtension?.properties.ids[0]
  const { data: message } = getPostQuery.useQuery(pinnedMessage ?? '', {
    enabled: !!pinnedMessage,
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
          <Image
            src={PinIcon}
            alt='pin'
            width={16}
            height={16}
            className='ml-3 h-4 w-4'
          />
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
