import { landingFont } from '@/fonts'
import { cx } from '@/utils/class-names'
import EarningsSection from './sections/EarningsSection'
import HeroSection from './sections/HeroSection'
import UsersSection from './sections/UsersSection'

export default function LandingPage() {
  return (
    <main
      className={cx(
        'space-y-48 bg-[#0F172A] text-white',
        landingFont.className
      )}
    >
      <HeroSection />
      <UsersSection className='relative z-10' />
      <EarningsSection className='relative z-0' />
      <div />
      <div />
      <div />
    </main>
  )
}
