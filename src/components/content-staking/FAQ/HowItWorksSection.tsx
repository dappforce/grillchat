import useGetTheme from '@/hooks/useGetTheme'
import BgGradient from '@/modules/LandingPage/common/BgGradient'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { useEffect, useState } from 'react'
import { mutedTextColorStyles, sectionTitleStyles } from '../utils/commonStyles'

const HowItWorksSection = () => {
  const sendEvent = useSendEvent()
  const theme = useGetTheme()
  const [showBgGradient, setShowBgGradient] = useState(true)

  useEffect(() => {
    setShowBgGradient(theme === 'dark')
  }, [theme])

  return (
    <div className='relative z-[1] flex w-full flex-col items-center gap-4'>
      {showBgGradient && (
        <BgGradient
          color='pink'
          className='absolute left-[171px] top-[40px] z-0 h-[740px] w-[740px] translate-x-full'
        />
      )}
      <div className='flex w-full flex-col items-center gap-2'>
        <div className={sectionTitleStyles}>How does it work?</div>
        <div
          className={cx(
            'text-base font-normal leading-[22px]',
            mutedTextColorStyles
          )}
        >
          Watch a quick video tutorial:
        </div>
      </div>
      <div className='flex w-full justify-center'>
        <iframe
          width='auto'
          height='auto'
          src='https://www.youtube.com/embed/dQw4w9WgXcQ?si=6LwW0mYXO6qO6eTU'
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
          className='h-[372px] w-full max-w-2xl rounded-2xl'
        ></iframe>
      </div>
    </div>
  )
}

export default HowItWorksSection
