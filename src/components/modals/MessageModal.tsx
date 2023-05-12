import { getPostQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import { CommentData } from '@subsocial/api/types'
import ChatItem from '../chats/ChatItem'
import Modal, { ModalFunctionalityProps } from './Modal'

export type MessageModalProps = ModalFunctionalityProps & {
  messageId: string
}

export default function MessageModal({
  messageId,
  ...props
}: MessageModalProps) {
  const { data: message } = getPostQuery.useQuery(messageId)
  const chatId = (message as unknown as CommentData)?.struct.rootPostId
  const { data: chat } = getPostQuery.useQuery(chatId)

  const chatTitle = chat?.content?.title || (
    <span className='ml-2 inline-block h-[1.3em] w-28 animate-pulse rounded-lg bg-background' />
  )

  return (
    <Modal
      {...props}
      title={
        <span className='flex items-center'>Message from {chatTitle}</span>
      }
    >
      <div
        className={cx(
          'rounded-2xl bg-background p-4',
          !message && 'h-28 animate-pulse'
        )}
      >
        {message && <ChatItem isMyMessage={false} message={message} />}
      </div>
    </Modal>
  )
}
