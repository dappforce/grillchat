import { getPostQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import { CommentData } from '@subsocial/api/types'
import { useState } from 'react'
import Button from '../Button'
import ChatItem from '../chats/ChatItem'
import Modal, { ModalFunctionalityProps } from './Modal'

export type MessageModalProps = ModalFunctionalityProps & {
  messageId: string
  scrollToMessage?: (messageId: string) => Promise<void>
}

export default function MessageModal({
  messageId,
  scrollToMessage,
  ...props
}: MessageModalProps) {
  const { data: message } = getPostQuery.useQuery(messageId)
  const chatId = (message as unknown as CommentData)?.struct.rootPostId
  const { data: chat } = getPostQuery.useQuery(chatId)

  const [isScrolling, setIsScrolling] = useState(false)

  const chatTitle = chat?.content?.title || (
    <span className='ml-2 inline-block h-[1.3em] w-28 animate-pulse rounded-lg bg-background' />
  )

  const handleScrollToMessage = async () => {
    if (!scrollToMessage) return

    setIsScrolling(true)
    await scrollToMessage(messageId)
    setIsScrolling(false)

    props.closeModal()
  }

  return (
    <Modal
      {...props}
      title={
        <span className='flex items-center'>Message from {chatTitle}</span>
      }
    >
      <div
        className={cx(
          'max-h-96 overflow-y-auto rounded-2xl bg-background p-4',
          !message && 'h-28 animate-pulse'
        )}
      >
        {message && (
          <ChatItem
            withCustomMenu={false}
            isMyMessage={false}
            message={message}
            chatId={chatId}
          />
        )}
      </div>
      {scrollToMessage && (
        <Button
          isLoading={isScrolling}
          onClick={handleScrollToMessage}
          className={cx('mt-6')}
          size='lg'
          variant='primary'
        >
          Scroll to message
        </Button>
      )}
    </Modal>
  )
}
