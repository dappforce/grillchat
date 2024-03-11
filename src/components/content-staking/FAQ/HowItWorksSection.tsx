import { YoutubeEmbed } from '@/components/chats/ChatItem/Embed'
import useGetTheme from '@/hooks/useGetTheme'
import BgGradient from '@/modules/LandingPage/common/BgGradient'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { useEffect, useState } from 'react'
import { mutedTextColorStyles, sectionTitleStyles } from '../utils/commonStyles'

const HowItWorksSection = () => {
  const sendEvent = useSendEvent()
  const theme = useGetTheme()
  const [showBgGradient, setShowBgGradient] = useState(false)

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
        <YoutubeEmbed
          className='flex aspect-video h-auto w-full max-w-2xl items-center justify-center rounded-3xl bg-white/10'
          link='https://www.youtube.com/watch?v=GADCpOW2Sy4'
          onClick={() => sendEvent('content_staking_start_video')}
        />
      </div>
    </div>
  )
}

export default HowItWorksSection
