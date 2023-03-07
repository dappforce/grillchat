import ChatPreview from '@/components/chats/ChatPreview'
import { getAllTopics } from '@/constants/topics'
import dynamic from 'next/dynamic'

const WelcomeModal = dynamic(() => import('./WelcomeModal'), { ssr: false })

export default function HomePage() {
  const topics = getAllTopics()

  return (
    <>
      <WelcomeModal />
      <div className='flex flex-col'>
        {Object.entries(topics).map(([key, { desc, image, title, postId }]) => (
          <ChatPreview
            key={title}
            asContainer
            asLink={{
              href: { pathname: '/chats/[topic]', query: { topic: key } },
            }}
            image={image}
            title={title}
            description={desc}
            postId={postId}
            withUnreadCount
          />
        ))}
      </div>
    </>
  )
}
