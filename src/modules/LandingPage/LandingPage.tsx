import { landingFont } from '@/fonts'
import { cx } from '@/utils/class-names'
import EarningsSection from './sections/EarningsSection'
import HeroSection from './sections/HeroSection'
import HowItWorksSection from './sections/HowItWorksSection'
import HowToEarnSection from './sections/HowToEarnSection'
import JoinSection from './sections/JoinSection'
import SubTokenSection from './sections/SubTokenSection'
import UsersSection from './sections/UsersSection'
import VideoSection from './sections/VideoSection'

export default function LandingPage() {
  return (
    <main
      className={cx(
        'space-y-48 overflow-x-clip bg-[#0F172A] text-white',
        landingFont.className
      )}
    >
      <HeroSection />

      <UsersSection className='relative z-10' />
      <EarningsSection className='relative z-0' />

      <VideoSection className='relative z-10' />
      <JoinSection className='relative z-0' />
      <SubTokenSection className='relative z-10' />

      <HowToEarnSection className='relative z-10' />
      <HowItWorksSection className='relative z-0' />
      <div />
      <div />
      <div />
    </main>
  )
}
