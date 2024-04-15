import { useMessageData } from '@/stores/message'
import ShouldStakeModal from '../content-staking/ShouldStakeModal'
import BlockedModal from '../moderation/BlockedModal'

export default function GlobalModals() {
  const isOpenMessageModal = useMessageData.use.isOpenMessageModal()
  const setOpenMessageModal = useMessageData.use.setOpenMessageModal()

  return (
    <>
      <BlockedModal
        isOpen={isOpenMessageModal === 'blocked'}
        closeModal={() => setOpenMessageModal('')}
      />
      <ShouldStakeModal
        isOpen={isOpenMessageModal === 'should-stake'}
        closeModal={() => setOpenMessageModal('')}
      />
    </>
  )
}
