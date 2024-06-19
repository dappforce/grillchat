import ConfirmationModal from '@/components/modals/ConfirmationModal'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import { useRemoveMyLinkedIdentity } from '@/services/api/mutation'
import { useMyAccount } from '@/stores/my-account'

export default function RemoveLinkedIdentityModal(
  props: ModalFunctionalityProps
) {
  const { mutate } = useRemoveMyLinkedIdentity({
    onSuccess: () => {
      useMyAccount.getState().logout()
      window.location.reload()
    },
  })
  return (
    <ConfirmationModal
      {...props}
      title='Are you sure to remove this account?'
      description='This action cannot be undone'
      primaryButtonProps={{
        children: 'Yes, remove this account',
        onClick: () => mutate(null),
      }}
      secondaryButtonProps={{ children: 'Cancel', onClick: props.closeModal }}
    />
  )
}
