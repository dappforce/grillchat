import Button from '@/components/Button'
import Modal, { ModalFunctionalityProps } from '@/components/Modal'
import { generateAccount } from '@/utils/account'

export type CaptchaModalProps = ModalFunctionalityProps

export default function CaptchaModal({ ...props }: CaptchaModalProps) {
  const submitCaptcha = async () => {
    const { publicKey, secretKey } = await generateAccount()
    console.log({ publicKey, secretKey })
    props.closeModal()
  }

  return (
    <Modal {...props} titleClassName='text-center' title='🤖 Are you a human?'>
      <div className='flex flex-col gap-6'>
        <div className='mt-4 text-center'>Captcha Here</div>
        <Button size='lg' onClick={submitCaptcha}>
          Continue
        </Button>
      </div>
    </Modal>
  )
}
