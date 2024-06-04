import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import WelcomeModal from '@/components/modals/WelcomeModal'
import { env } from '@/env.mjs'
import ChatContent from '../chat/HomePage/ChatContent'

const hubId = env.NEXT_PUBLIC_MAIN_SPACE_ID
const chatId = env.NEXT_PUBLIC_MAIN_CHAT_ID

const MemesPage = () => {
  return (
    <LayoutWithBottomNavigation withFixedHeight className='relative'>
      <WelcomeModal />
      <ChatsContent />
    </LayoutWithBottomNavigation>
  )
}

const ChatsContent = () => {
  return <ChatContent hubId={hubId} chatId={chatId} />
}

export default MemesPage
