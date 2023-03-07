import ChatRoom from '@/components/chats/ChatRoom'
import { Topic } from '@/constants/topics'
import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { useEffect } from 'react'
import ChatNavbarExtension from './ChatNavbarExtension'

export default function ChatPage({ topic }: { topic: Topic }) {
  const { data } = useCommentIdsByPostId(topic.postId, { subscribe: true })

  const { setLastReadMessageId } = useLastReadMessageId(topic.postId)

  useEffect(() => {
    const lastId = data?.[data.length - 1]
    if (!lastId) return
    setLastReadMessageId(lastId)
  }, [setLastReadMessageId, data])

  return (
    <>
      <ChatNavbarExtension
        image={topic.image}
        messageCount={data?.length ?? 0}
        topic={topic.title}
      />
      <ChatRoom
        postId={topic.postId}
        asContainer
        className='flex-1 overflow-hidden'
      />
    </>
  )
}
