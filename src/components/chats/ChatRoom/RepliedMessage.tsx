import { getPostQuery } from '@/services/api/query'
import { ComponentProps } from 'react'
import { BsFillReplyFill } from 'react-icons/bs'

export type RepliedMessageProps = ComponentProps<'div'> & {
  replyChatId: string
}

export default function RepliedMessage({ replyChatId }: RepliedMessageProps) {
  const { data } = getPostQuery.useQuery(replyChatId)
  const chatContent = data?.content?.body
  return (
    <div className='flex items-center gap-4 overflow-hidden pb-2'>
      <BsFillReplyFill className='flex-shrink-0 text-lg' />
      <span className='overflow-hidden overflow-ellipsis whitespace-nowrap'>
        {chatContent}
      </span>
    </div>
  )
}
