import Modal, { ModalFunctionalityProps } from '../modals/Modal'
import ModerationForm from './ModerationForm'

export type ModerationModalProps = ModalFunctionalityProps & {
  messageId: string
  chatId?: string
  isFromWidget?: boolean
}

export default function ModerationModal({
  messageId,
  chatId,
  isFromWidget,
  ...props
}: ModerationModalProps) {
  return (
    <Modal
      {...props}
      title='🛡 Moderate'
      description='Moderated content will not be deleted from the blockchain, but will not be shown to users on Epic.'
      withCloseButton
    >
      <div className='mt-2'>
        <ModerationForm
          onSuccess={() => props.closeModal()}
          chatId={chatId}
          messageId={messageId}
          isFromWidget={isFromWidget}
        />
      </div>
    </Modal>
  )
}
