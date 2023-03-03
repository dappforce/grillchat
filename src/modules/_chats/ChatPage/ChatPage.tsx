import Bitcoin from '@/assets/topics/bitcoin.png'
import ChatRoom from '@/components/chats/ChatRoom'
import { useRouter } from 'next/router'
import ChatNavbarExtension from './ChatNavbarExtension'

export default function ChatPage({ postId }: { postId: string }) {
  const router = useRouter()
  const { topic } = router.query as { topic: string }

  return (
    <>
      <ChatNavbarExtension image={Bitcoin} messageCount={96} topic={topic} />
      <ChatRoom
        postId={postId}
        asContainer
        className='flex-1 overflow-hidden pt-2'
      />
    </>
  )
}
