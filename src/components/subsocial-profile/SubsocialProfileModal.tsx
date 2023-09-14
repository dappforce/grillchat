import { toast } from 'react-hot-toast'
import Button from '../Button'
import Modal, { ModalFunctionalityProps, ModalProps } from '../modals/Modal'
import Toast from '../Toast'
import SubsocialProfileForm from './SubsocialProfileForm'

export type SubsocialProfileModalProps = ModalFunctionalityProps &
  Pick<ModalProps, 'onBackClick' | 'title'> & {
    cancelButtonText?: string
  }

export default function SubsocialProfileModal({
  title,
  cancelButtonText,
  ...props
}: SubsocialProfileModalProps) {
  const onSuccess = () => {
    props.closeModal()
    toast.custom((t) => <Toast t={t} title='Your name was set' />)
  }

  return (
    <Modal
      {...props}
      title={title || '🎩 Update name'}
      description='This will help other people recognize you better. You can change it at any time.'
    >
      <SubsocialProfileForm onSuccess={onSuccess} />
      {cancelButtonText && (
        <Button
          onClick={() => props.closeModal()}
          size='lg'
          variant='primaryOutline'
          className='mt-4'
        >
          {cancelButtonText}
        </Button>
      )}
    </Modal>
  )
}
