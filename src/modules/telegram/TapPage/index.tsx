import Button from '@/components/Button'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import PointsWidget from '@/modules/points/PointsWidget'
import { cx, mutedTextColorStyles } from '@/utils/class-names'
import PointsClicker from './PointsClicker'

const TapPage = () => {
  return (
    <LayoutWithBottomNavigation
      className='relative'
      style={{ minHeight: '100dvh' }}
    >
      <PointsWidget className='sticky top-0' />
      <TapPageContent />
    </LayoutWithBottomNavigation>
  )
}

const TapPageContent = () => {
  return (
    <div className='grid flex-1 grid-rows-[70%,30%] items-center'>
      <PointsClicker className='justify-self-center' />
      <div className='flex flex-col items-center gap-[22px] px-4'>
        <span className={cx('text-center', mutedTextColorStyles)}>
          Tap2Earn is coming soon! While you wait, start earning points today by
          creating and liking memes.
        </span>

        <Button variant='primary' size={'md'} className='w-fit'>
          Try Meme to Earn
        </Button>
      </div>
    </div>
  )
}

export default TapPage
