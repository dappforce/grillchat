import Button from '@/components/Button'
import { getPostQuery } from '@/services/api/query'
import { useMessageData } from '@/stores/message'
import { ComponentProps } from 'react'
import { HiXMark } from 'react-icons/hi2'
import { LuPencil, LuReply } from 'react-icons/lu'
import RepliedMessagePreview from '../ChatItem/RepliedMessagePreview'
import usePinnedMessage from '../hooks/usePinnedMessage'
import { getMessageElementId, scrollToMessageElement } from '../utils'

export type ActionDetailBarProps = ComponentProps<'div'> & {
  scrollContainer?: React.RefObject<HTMLElement | null>
  chatId: string
  hubId: string
}

export default function ActionDetailBar({
  scrollContainer,
  hubId,
  chatId,
}: ActionDetailBarProps) {
  const clearAction = useMessageData((state) => state.clearAction)
  const replyTo = useMessageData((state) => state.replyTo)
  const messageToEdit = useMessageData((state) => state.messageToEdit)
  const messageId = replyTo || messageToEdit

  const { data: message } = getPostQuery.useQuery(messageId, {
    enabled: !!messageId,
  })

  const pinnedMessageId = usePinnedMessage(chatId)
  const onMessageClick = async (messageId: string) => {
    const element = document.getElementById(getMessageElementId(messageId))
    await scrollToMessageElement(element, scrollContainer?.current ?? null, {
      scrollOffset: pinnedMessageId ? 'large' : 'normal',
    })
  }

  if (!messageId) return <div className='pt-2' />

  return (
    <div
      className='flex cursor-pointer items-center overflow-hidden border-t border-border-gray pb-3 pt-2'
      onClick={() => onMessageClick(replyTo)}
    >
      {replyTo ? (
        <div className='flex-shrink-0 pl-2 pr-4 text-text-muted'>
          <LuReply className='text-lg' />
        </div>
      ) : (
        <div className='flex-shrink-0 pl-2 pr-4 text-text-muted'>
          <LuPencil className='text-lg' />
        </div>
      )}
      <RepliedMessagePreview
        isEditing={!!messageToEdit}
        originalMessage={message?.content?.body || ''}
        className='w-full'
        repliedMessageId={messageId}
        scrollToMessage={onMessageClick}
        chatId={chatId}
        hubId={hubId}
      />
      <Button
        size='noPadding'
        className='mx-3 flex-shrink-0'
        variant='transparent'
        onClick={(e) => {
          e.stopPropagation()
          clearAction()
        }}
      >
        <HiXMark className='text-2xl' />
      </Button>
    </div>
  )
}
