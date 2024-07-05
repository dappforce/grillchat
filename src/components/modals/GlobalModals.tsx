import { useMessageData } from '@/stores/message'
import BlockedModal from '../moderation/BlockedModal'
import PostMemeThresholdModal from './PostMemeThresholdModal'

export default function GlobalModals() {
  const isOpenMessageModal = useMessageData.use.isOpenMessageModal()
  const currentChatId = useMessageData.use.currentChatId()
  const setOpenMessageModal = useMessageData.use.setOpenMessageModal()

  return (
    <>
      <PostMemeThresholdModal
        chatId={currentChatId}
        isOpen={isOpenMessageModal === 'not-enough-balance'}
        closeModal={() => setOpenMessageModal('')}
      />
      <BlockedModal
        isOpen={isOpenMessageModal === 'blocked'}
        closeModal={() => setOpenMessageModal('')}
      />
    </>
  )
}
