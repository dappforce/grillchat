import PluralText from '@/components/PluralText'
import { SortChatOption } from '@/modules/chat/hooks/useSortedChats'
import { getPostQuery } from '@/services/api/query'
import { getCommentIdsByPostIdQuery } from '@/services/subsocial/commentIds'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { ComponentProps } from 'react'
import useLastMessage from './hooks/useLastMessage'

export type ChatAdditionalInfoProps = ComponentProps<'span'> & {
  chatId: string
  chatInfo?: SortChatOption
}

export default function ChatAdditionalInfo({
  chatId,
  chatInfo = 'activity',
  ...props
}: ChatAdditionalInfoProps) {
  switch (chatInfo) {
    case 'activity':
      return <ChatLastMessageTime chatId={chatId} {...props} />
    case 'members':
      return <ChatMembersCount chatId={chatId} {...props} />
    case 'messages':
      return <ChatMessagesCount chatId={chatId} {...props} />
    default:
      return null
  }
}

type ChatAdditionalInfoDataProps = Omit<ChatAdditionalInfoProps, 'chatInfo'>
function ChatLastMessageTime({
  chatId,
  ...props
}: ChatAdditionalInfoDataProps) {
  const { data: lastMessage } = useLastMessage(chatId)
  const time = lastMessage?.struct.createdAtTime
  if (!time) return null

  return (
    <span {...props} className={cx('whitespace-nowrap', props.className)}>
      {getTimeRelativeToNow(time)}
    </span>
  )
}

function ChatMembersCount({ chatId, ...props }: ChatAdditionalInfoDataProps) {
  const { data: chat } = getPostQuery.useQuery(chatId)

  const membersCount = chat?.struct.followersCount ?? 0
  return (
    <span {...props} className={cx('whitespace-nowrap', props.className)}>
      {membersCount}{' '}
      <PluralText count={membersCount} plural='members' singular='member' />
    </span>
  )
}

function ChatMessagesCount({ chatId, ...props }: ChatAdditionalInfoDataProps) {
  const { data: messageIds } = getCommentIdsByPostIdQuery.useQuery(chatId)
  const messagesCount = messageIds?.length ?? 0

  return (
    <span {...props} className={cx('whitespace-nowrap', props.className)}>
      {messagesCount}{' '}
      <PluralText count={messagesCount} plural='messages' singular='message' />
    </span>
  )
}
