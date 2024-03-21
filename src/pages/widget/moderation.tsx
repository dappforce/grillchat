import ModerationModal from '@/components/moderation/ModerationModal'
import useIsModerationAdmin from '@/hooks/useIsModerationAdmin'
import { useMyMainAddress } from '@/stores/my-account'
import { useEffect, useState } from 'react'

export default function ModerationPage() {
  const [isOpen, setIsOpen] = useState(true)
  const myAddress = useMyMainAddress()
  const isAdmin = useIsModerationAdmin(myAddress ?? '')

  const [postToModerate, setPostToModerate] = useState('68319')

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      const eventData = event.data
      if (eventData && eventData.type === 'grill:moderate') {
        const payload = eventData.payload as string
        setPostToModerate(payload)
        if (isAdmin) setIsOpen(true)
      }
    }
    window.addEventListener('message', handler)

    return () => {
      window.removeEventListener('message', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ModerationModal
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      messageId={postToModerate}
      withoutRevalidateCurrentPath
    />
  )
}
