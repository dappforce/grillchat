import Modal, {
  ModalFunctionalityProps,
  ModalProps,
} from '@/components/modals/Modal'
import UpsertChatForm, { UpsertChatFormProps } from './UpsertChatForm'

export type UpsertChatModalProps = ModalFunctionalityProps &
  Pick<ModalProps, 'onBackClick'> & {
    formProps: UpsertChatFormProps
  }

export default function UpsertChatModal({
  formProps,
  ...props
}: UpsertChatModalProps) {
  const isUpdating = 'chat' in formProps && formProps.chat
  const title = isUpdating ? '✏️ Edit chat' : '💬 New Chat'

  const augmentedFormProps: UpsertChatFormProps = {
    ...formProps,
    onSuccess: () => {
      if (isUpdating) props.closeModal()
      formProps.onSuccess?.()
    },
    onTxSuccess: () => {
      props.closeModal()
      formProps.onTxSuccess?.()
    },
  }

  return (
    <Modal {...props} title={title} withCloseButton={!props.onBackClick}>
      <UpsertChatForm {...augmentedFormProps} />
    </Modal>
  )
}
