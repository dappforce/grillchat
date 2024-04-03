import NewCommunityModal from '@/components/community/NewCommunityModal'
import { useCreateChatModal } from '@/stores/create-chat-modal'
import { useMyMainAddress } from '@/stores/my-account'
import { useEffect, useState } from 'react'

export default function CreateChatPage() {
  const myAddress = useMyMainAddress()
  const [spaceId, setSpaceId] = useState('')

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
        const [state, spaceId] = payload.split('|')

        if (state === 'open' && spaceId) {
          useCreateChatModal
            .getState()
            .openModal({ defaultOpenState: 'create-chat' })

          setSpaceId(spaceId)
        } else {
          setSpaceId('')
        }
      }
    }
    window.addEventListener('message', handler)

    return () => {
      window.removeEventListener('message', handler)
    }
  }, [])

  return <NewCommunityModal withBackButton={false} hubId={spaceId} />
}
