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
            Grill&apos;s content policy.
          </CustomLink>
        </span>
      }
      description='You are now restricted from taking actions on Grill, but can still manage your locked SUB, and use other applications running on the Subsocial network.'
    >
      <div className='grid w-full grid-cols-2 gap-4'>
        <Button size='lg' variant='primary' href='/staking'>
          Manage SUB
        </Button>
        <Button size='lg' variant='primaryOutline' href='/appeal'>
          Appeal
        </Button>
      </div>
    </Modal>
  )
}
