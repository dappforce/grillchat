import { cx } from '@/utils/class-names'
import { useState } from 'react'
import AddressAvatar, { AddressAvatarProps } from './AddressAvatar'
import Modal from './modals/Modal'
import ProfilePreview from './ProfilePreview'

export type ClickableAddressAvatarProps = Omit<AddressAvatarProps, 'ref'>

export default function ClickableAddressAvatar({
  ...props
}: ClickableAddressAvatarProps) {
  const [isOpenAccountModal, setIsOpenAccountModal] = useState(false)

  return (
    <>
      <AddressAvatar
        {...props}
        className={cx('cursor-pointer', props.className)}
        onClick={(e) => {
          props.onClick?.(e)
          setIsOpenAccountModal(true)
        }}
      />
      <Modal
        title='Profile'
        withCloseButton
        isOpen={isOpenAccountModal}
        closeModal={() => setIsOpenAccountModal(false)}
      >
        <ProfilePreview address={props.address} className='mb-2' />
        {/* <ActionCard
          className='mt-6'
          actions={[
            {
              icon: DonateIcon,
              iconClassName: 'text-text-muted',
              text: 'Donate',
              onClick: () => undefined,
            },
          ]}
        /> */}
      </Modal>
    </>
  )
}
