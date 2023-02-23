import Button from '@/components/Button'
import Modal, { ModalFunctionalityProps } from '@/components/Modal'

export type CaptchaModalProps = ModalFunctionalityProps

export default function CaptchaModal({ ...props }: CaptchaModalProps) {
  return (
    <Modal {...props} titleClassName='text-center' title='🤖 Are you a human?'>
      <div className='flex flex-col gap-6'>
        <div className='mt-4 text-center'>Captcha Here</div>
        <Button size='lg' onClick={props.closeModal}>
          Continue
        </Button>
      </div>
    </Modal>
  )
}
