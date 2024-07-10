import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import HomePageModals from '@/components/modals/HomePageModals'
import LikeIntroModal from '@/components/modals/LikeIntroModal'
import useTgNoScroll from '@/hooks/useTgNoScroll'
import ChatContent from '../chat/HomePage/ChatContent'

const MemesPage = () => {
  useTgNoScroll()
  return (
    <LayoutWithBottomNavigation withFixedHeight className='relative'>
      <LikeIntroModal />
      <ChatContent />
      <HomePageModals />
    </LayoutWithBottomNavigation>
  )
}

export default MemesPage
