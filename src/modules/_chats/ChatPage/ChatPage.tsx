import Bitcoin from '@/assets/topics/bitcoin.png'
import ScrollableContainer from '@/components/ScrollableContainer'
import { useRouter } from 'next/router'
import ChatNavbarExtension from './ChatNavbarExtension'

export default function ChatPage() {
  const router = useRouter()
  const { topic } = router.query as { topic: string }

  return (
    <>
      <ChatNavbarExtension image={Bitcoin} messageCount={96} topic={topic} />
      <ScrollableContainer></ScrollableContainer>
    </>
  )
}
