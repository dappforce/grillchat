import { useExtensionModalState } from '@/stores/extension'
import { ExtensionModalsProps } from '..'
import CommonExtensionModal from '../CommonExtensionModal'

export default function SecretBoxModal(props: ExtensionModalsProps) {
  const { closeModal, isOpen } = useExtensionModalState('subsocial-secret-box')

  return (
    <CommonExtensionModal isOpen={isOpen} closeModal={closeModal} {...props}>
      asdfioasdhfauisdh
    </CommonExtensionModal>
  )
}
