import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { Proposal } from '@/server/opengov/mapper'

export default function ProposalMetadataModal({
  proposal,
  ...props
}: ModalFunctionalityProps & { proposal: Proposal }) {
  return (
    <Modal {...props} title='Metadata' withCloseButton>
      asdfasdffsd
    </Modal>
  )
}
