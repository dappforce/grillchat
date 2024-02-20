import { landingFont } from '@/fonts'
import { cx } from '@/utils/class-names'
import HeroSection from './sections/HeroSection'
import UsersSection from './sections/UsersSection'

export default function LandingPage() {
  return (
    <main className={cx('text-white', landingFont.className)}>
      <HeroSection />
      <UsersSection />
    </main>
  )
}
