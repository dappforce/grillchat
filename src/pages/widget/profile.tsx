import ProfileModal from '@/components/auth/ProfileModal'
import { useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { sendMessageToParentWindow } from '@/utils/window'
import { useEffect } from 'react'

export default function ProfilePage() {
  const myAddress = useMyMainAddress()
  useEffect(() => {
    if (myAddress) {
      useProfileModal.getState().openModal()
    } else {
      sendMessageToParentWindow('profile', 'close')
      useProfileModal.getState().closeModal()
    }
  }, [myAddress])

  return <ProfileModal />
}
