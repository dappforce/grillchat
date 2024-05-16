import Button from '../Button'
import Modal, { ModalFunctionalityProps } from '../modals/Modal'
import CustomLink from '../referral/CustomLink'
import { CONTENT_POLICY_LINK } from './utils'

export default function BlockedModal(props: ModalFunctionalityProps) {
  return (
    <Modal
      {...props}
      title={
        <span>
          Your account was blocked due to a violation of{' '}
          <CustomLink forceHardNavigation href={CONTENT_POLICY_LINK}>
            Epic&apos;s content policy.
          </CustomLink>
        </span>
      }
      description='You are now restricted from taking actions on Epic.'
    >
      <div className='grid w-full grid-cols-2 gap-4'>
        <Button size='lg' variant='primaryOutline' href='/appeal'>
          Appeal
        </Button>
      </div>
    </Modal>
  )
}
