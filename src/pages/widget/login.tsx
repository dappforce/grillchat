import LoginModal from '@/components/auth/LoginModal'
import ProfileModal from '@/components/auth/ProfileModal'
import { useLoginModal } from '@/stores/login-modal'
import { getIsLoggedIn } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    if (!getIsLoggedIn()) {
      useLoginModal.getState().setIsOpen(true)
    } else {
      useProfileModal.getState().openModal()
    }
  }, [])

  return (
    <>
      <LoginModal disableOutsideClickClose withoutOverlay withoutShadow />
      <ProfileModal disableOutsideClickClose withoutOverlay withoutShadow />
    </>
  )
}
