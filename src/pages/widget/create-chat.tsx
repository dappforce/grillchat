import NewCommunityModal from '@/components/community/NewCommunityModal'
import { communityHubId } from '@/modules/chat/HomePage'
import { useCreateChatModal } from '@/stores/create-chat-modal'
import { useMyMainAddress } from '@/stores/my-account'
import { useEffect } from 'react'

export default function CreateChatPage() {
  const myAddress = useMyMainAddress()

  useEffect(() => {
    if (myAddress) {
      useCreateChatModal
        .getState()
        .openModal({ defaultOpenState: 'create-chat' })
    } else {
      useCreateChatModal.getState().closeModal()
    }
  }, [myAddress])

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      const eventData = event.data
      if (eventData && eventData.type === 'grill:create-chat') {
        const payload = eventData.payload as string
        if (payload === 'open') {
          useCreateChatModal
            .getState()
            .openModal({ defaultOpenState: 'create-chat' })
        }
      }
    }
    window.addEventListener('message', handler)

    return () => {
      window.removeEventListener('message', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <NewCommunityModal withBackButton={false} hubId={communityHubId} />
}
