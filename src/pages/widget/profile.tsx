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

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      const eventData = event.data
      if (eventData && eventData.type === 'grill:profile') {
        const payload = eventData.payload as string
        if (payload === 'open') {
          useProfileModal.getState().openModal()
        }
      }
    }
    window.addEventListener('message', handler)

    return () => {
      window.removeEventListener('message', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <ProfileModal />
}
