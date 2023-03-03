import ChatRoom from '@/components/chats/ChatRoom'
import { Topic } from '@/constants/topics'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import ChatNavbarExtension from './ChatNavbarExtension'

export default function ChatPage({ topic }: { topic: Topic }) {
  const { data } = useCommentIdsByPostId(topic.postId, { subscribe: true })

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
