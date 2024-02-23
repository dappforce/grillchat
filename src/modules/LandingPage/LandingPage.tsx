import { landingFont } from '@/fonts'
import { cx } from '@/utils/class-names'
import { useInView } from 'react-intersection-observer'
import Footer from './Footer'
import Navbar from './Navbar'
import CommunitySection from './sections/CommunitySection'
import EarlyBirdSection from './sections/EarlyBirdSection'
import EarningsSection from './sections/EarningsSection'
import GrowSection from './sections/GrowSection'
import HeroSection from './sections/HeroSection'
import HowItWorksSection from './sections/HowItWorksSection'
import HowToEarnSection from './sections/HowToEarnSection'
import JoinSection from './sections/JoinSection'
import QuestionsSection from './sections/QuestionsSection'
import SubAvailableSection from './sections/SubAvailableSection'
import SubTokenSection from './sections/SubTokenSection'
import UsersSection from './sections/UsersSection'
import VideoSection from './sections/VideoSection'

export default function LandingPage() {
  const { ref, inView } = useInView({ initialInView: true })

  return (
    <>
      <Navbar isShowing={!inView} />
      <main
        className={cx(
          'space-y-24 overflow-x-clip bg-[#0F172A] text-white md:space-y-44 [&>*]:px-4',
          landingFont.className
        )}
      >
        <HeroSection ref={ref} />

        <UsersSection className='relative z-20 !mt-12 sm:!mt-8 md:!mt-28' />
        <EarningsSection className='relative z-10' />

        <VideoSection className='relative z-0' />
        <JoinSection className='relative z-10' />
        <SubTokenSection className='relative z-10' />

        <HowToEarnSection className='relative z-10' />
        <HowItWorksSection className='relative z-0' />

        <EarlyBirdSection className='relative z-10' />
        <GrowSection className='relative z-10' />
        <JoinSection className='relative z-10' />

        <SubAvailableSection className='relative z-0' />
        <CommunitySection className='relative z-10' />
        <QuestionsSection className='relative z-0' />
        <Footer className='relative z-10' />
      </main>
    </>
  )
}
