import CaptchaTermsAndService from '@/components/captcha/CaptchaTermsAndService'
import NavbarExtension from '@/components/navbar/NavbarExtension'
import { ESTIMATED_ENERGY_FOR_ONE_TX } from '@/constants/subsocial'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'

export default function ChatPageNavbarExtension() {
  const shouldSendMessageWithoutCaptcha = useMyAccount((state) => {
    const isEnergyLoading = state.address && state.energy === null
    if (!state.isInitialized || isEnergyLoading) return true

    const isLoggedIn = !!state.address
    const hasEnoughEnergy = (state.energy ?? 0) > ESTIMATED_ENERGY_FOR_ONE_TX
    return isLoggedIn && hasEnoughEnergy
  })

  if (shouldSendMessageWithoutCaptcha) return null

  return (
    <NavbarExtension className={cx('py-2 sm:py-2.5')}>
      <CaptchaTermsAndService className='text-center' />
    </NavbarExtension>
  )
}
