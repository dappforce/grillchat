import Modal, { ModalFunctionalityProps } from '../modals/Modal'
import ModerationForm from './ModerationForm'

export type ModerationModalProps = ModalFunctionalityProps & {
  messageId: string
  chatId: string
  hubId: string
}

export default function ModerationModal({
  messageId,
  chatId,
  hubId,
  ...props
}: ModerationModalProps) {
  return (
    <Modal
      {...props}
      title='🛡 Moderate'
      description='Moderated content will not be deleted from the blockchain but be hidden from the other users in Grill.chat.'
    >
      <div className='mt-2'>
        <ModerationForm
          onSuccess={() => props.closeModal()}
          chatId={chatId}
          hubId={hubId}
          messageId={messageId}
        />
      </div>
    </Modal>
  )
}
