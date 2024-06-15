import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import Meme2EarnIntroModal from '@/components/modals/Meme2EarnIntroModal'
import { env } from '@/env.mjs'
import useTgNoScroll from '@/hooks/useTgNoScroll'
import ChatContent from '../chat/HomePage/ChatContent'

const hubId = env.NEXT_PUBLIC_MAIN_SPACE_ID
const chatId = env.NEXT_PUBLIC_MAIN_CHAT_ID

const MemesPage = () => {
  useTgNoScroll()
  return (
    <LayoutWithBottomNavigation withFixedHeight className='relative'>
      <Meme2EarnIntroModal />
      <ChatsContent />
    </LayoutWithBottomNavigation>
  )
}

const ChatsContent = () => {
  return <ChatContent hubId={hubId} chatId={chatId} />
}

export default MemesPage