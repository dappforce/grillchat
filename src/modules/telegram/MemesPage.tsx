import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import { env } from '@/env.mjs'
import useIsMounted from '@/hooks/useIsMounted'
import { SDKProvider } from '@tma.js/sdk-react'
import ChatContent from '../chat/HomePage/ChatContent'

const hubId = env.NEXT_PUBLIC_MAIN_SPACE_ID
const chatId = env.NEXT_PUBLIC_MAIN_CHAT_ID

const MemesPage = () => {
  const isMounted = useIsMounted()

  return (
    <SDKProvider>
      <LayoutWithBottomNavigation withFixedHeight className='relative'>
        {isMounted && <StatsPageContent />}
      </LayoutWithBottomNavigation>
    </SDKProvider>
  )
}

const StatsPageContent = () => {
  return <ChatContent hubId={hubId} chatId={chatId} />
}

export default MemesPage
