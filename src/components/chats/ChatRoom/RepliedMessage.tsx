import Button from '@/components/Button'
import { getPostQuery } from '@/services/api/query'
import { useMessageData } from '@/stores/message'
import { ComponentProps } from 'react'
import { BsFillReplyFill } from 'react-icons/bs'
import { HiXMark } from 'react-icons/hi2'
import RepliedMessagePreview from '../ChatItem/RepliedMessagePreview'
import usePinnedMessage from '../hooks/usePinnedMessage'
import { getMessageElementId, scrollToMessageElement } from '../utils'

export type RepliedMessageProps = ComponentProps<'div'> & {
  replyMessageId: string
  scrollContainer?: React.RefObject<HTMLDivElement>
  chatId: string
  hubId: string
}

export default function RepliedMessage({
  replyMessageId,
  scrollContainer,
  hubId,
  chatId,
}: RepliedMessageProps) {
  const clearReplyTo = useMessageData((state) => state.clearReplyTo)

  const { data: message } = getPostQuery.useQuery(replyMessageId)

  const pinnedMessage = usePinnedMessage(chatId)
  const onRepliedMessageClick = async (messageId: string) => {
    const element = document.getElementById(getMessageElementId(messageId))
    await scrollToMessageElement(element, scrollContainer?.current ?? null, {
      scrollOffset: pinnedMessage ? 'large' : 'normal',
    })
  }

  return (
    <div
      className='flex cursor-pointer items-center overflow-hidden border-t border-border-gray pb-3 pt-2'
      onClick={() => onRepliedMessageClick(replyMessageId)}
    >
      <div className='flex-shrink-0 pl-2 pr-3 text-text-muted'>
        <BsFillReplyFill className='text-2xl' />
      </div>
      <RepliedMessagePreview
        originalMessage={message?.content?.body || ''}
        className='mt-1 w-full'
        repliedMessageId={replyMessageId}
        scrollToMessage={onRepliedMessageClick}
        chatId={chatId}
        hubId={hubId}
      />
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
