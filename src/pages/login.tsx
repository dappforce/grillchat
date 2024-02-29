import LoginModal from '@/components/auth/LoginModal'
import { useLoginModal } from '@/stores/login-modal'
import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    useLoginModal.getState().setIsOpen(true)
  }, [])

  return <LoginModal disableOutsideClickClose withoutOverlay withoutShadow />
}
