import { toast } from 'react-hot-toast'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
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
    toast.custom((t) => (
      <Toast
        t={t}
        title='Your username was set'
        icon={(className) => (
          <HiOutlineInformationCircle className={className} />
        )}
      />
    ))
  }

  return (
    <Modal
      {...props}
      title={title || '🎩 Update name'}
      description='Create a name so other people can recognize you. You can change it at any time.'
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
