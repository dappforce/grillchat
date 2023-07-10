import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useExtensionData } from '@/stores/extension'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import { RiCopperCoinLine } from 'react-icons/ri'
import ActionCard from './ActionCard'
import Modal from './modals/Modal'
import Name, { NameProps } from './Name'
import ProfilePreview from './ProfilePreview'

export type ProfilePreviewModalWrapperProps = {
  address: string
  children: (
    onClick: (e: { stopPropagation: () => void }) => void
  ) => React.ReactNode
}

export default function ProfilePreviewModalWrapper({
  address,
  children,
}: ProfilePreviewModalWrapperProps) {
  const openExtensionModal = useExtensionData(
    (state) => state.openExtensionModal
  )
  const [isOpenAccountModal, setIsOpenAccountModal] = useState(false)
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const { evmAddress } = accountData || {}

  return (
    <>
      {children((e) => {
        e.stopPropagation()
        setIsOpenAccountModal(true)
      })}
      <Modal
        title='Profile'
        withCloseButton
        isOpen={isOpenAccountModal}
        closeModal={() => setIsOpenAccountModal(false)}
      >
        <ProfilePreview address={address} className='mb-2' />
        {evmAddress && (
          <ActionCard
            className='mt-2'
            actions={[
              {
                icon: RiCopperCoinLine,
                text: 'Donate',
                iconClassName: cx('text-text-muted'),
                onClick: () =>
                  openExtensionModal('subsocial-donations', {
                    recipient: address,
                  }),
              },
            ]}
          />
        )}
      </Modal>
    </>
  )
}

export function ProfilePreviewModalName({ ...props }: NameProps) {
  return (
    <ProfilePreviewModalWrapper address={props.address}>
      {(onClick) => (
        <Name
          {...props}
          onClick={(e) => {
            onClick(e)
            props.onClick?.(e)
          }}
          className={cx('cursor-pointer', props.className)}
          address={props.address}
        />
      )}
    </ProfilePreviewModalWrapper>
  )
}
