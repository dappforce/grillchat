import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import { env } from '@/env.mjs'
import useIsMounted from '@/hooks/useIsMounted'
import ChatContent from '../chat/HomePage/ChatContent'

const hubId = env.NEXT_PUBLIC_MAIN_SPACE_ID
const chatId = env.NEXT_PUBLIC_MAIN_CHAT_ID

const MemesPage = () => {
  const isMounted = useIsMounted()

  return (
    <LayoutWithBottomNavigation withFixedHeight className='relative'>
      {isMounted && <ChatsContent />}
    </LayoutWithBottomNavigation>
  )
}

const ChatsContent = () => {
  return <ChatContent hubId={hubId} chatId={chatId} />
}

export default MemesPage
