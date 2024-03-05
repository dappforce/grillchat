import ProfileModal from '@/components/auth/ProfileModal'
import { useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { useEffect } from 'react'

export default function ProfilePage() {
  const myAddress = useMyMainAddress()
  useEffect(() => {
    if (myAddress) {
      useProfileModal.getState().openModal()
    } else {
      useProfileModal.getState().closeModal()
    }
  }, [myAddress])

  return <ProfileModal />
}
