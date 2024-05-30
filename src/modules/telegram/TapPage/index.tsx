import Button from '@/components/Button'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import useIsMounted from '@/hooks/useIsMounted'
import { cx, mutedTextColorStyles } from '@/utils/class-names'
import PointsClicker from './PointsClicker'

const TapPage = () => {
  const isMounted = useIsMounted()

  return (
    <LayoutWithBottomNavigation
      className='relative'
      style={{ minHeight: '100dvh' }}
    >
      {isMounted && <TapPageContent />}
    </LayoutWithBottomNavigation>
  )
}

const TapPageContent = () => {
  return (
    <div className='grid flex-1 grid-rows-[2fr,1fr] items-center'>
      <PointsClicker className='justify-self-center' />
      <div className='flex flex-col items-center gap-[22px]'>
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
