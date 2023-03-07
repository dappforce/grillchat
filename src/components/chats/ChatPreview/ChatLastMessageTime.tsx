import { getTimeRelativeToNow } from '@/utils/date'
import { ComponentProps } from 'react'
import useLastMessage from './hooks/useLastMessage'

export type ChatLastMessageTimeProps = ComponentProps<'div'> & {
  postId: string
}

export default function ChatLastMessageTime({
  postId,
  ...props
}: ChatLastMessageTimeProps) {
  const { data: lastMessage } = useLastMessage(postId)
  const time = lastMessage?.struct.createdAtTime
  if (!time) return null

  return <span {...props}>{getTimeRelativeToNow(time)}</span>
}
