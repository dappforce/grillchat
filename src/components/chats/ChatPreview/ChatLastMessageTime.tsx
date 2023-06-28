import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { ComponentProps } from 'react'
import useLastMessage from './hooks/useLastMessage'

export type ChatLastMessageTimeProps = ComponentProps<'div'> & {
  chatId: string
}

export default function ChatLastMessageTime({
  chatId,
  ...props
}: ChatLastMessageTimeProps) {
  const { data: lastMessage } = useLastMessage(chatId)
  const time = lastMessage?.struct.createdAtTime
  if (!time) return null

  return (
    <span {...props} className={cx('whitespace-nowrap', props.className)}>
      {getTimeRelativeToNow(time)}
    </span>
  )
}
