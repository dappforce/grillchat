import Modal, { ModalFunctionalityProps } from '../modals/Modal'
import ModerationForm from './ModerationForm'

export type ModerationModalProps = ModalFunctionalityProps & {
  messageId: string
}

export default function ModerationModal({
  messageId,
  ...props
}: ModerationModalProps) {
  return (
    <Modal {...props}>
      <ModerationForm messageId={messageId} />
    </Modal>
  )
}
