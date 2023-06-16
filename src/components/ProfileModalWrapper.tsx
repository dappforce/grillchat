import { useState } from 'react'
import Modal from './modals/Modal'
import ProfilePreview from './ProfilePreview'

export type ProfileModalWrapperProps = {
  address: string
  children: (
    onClick: (e: { stopPropagation: () => void }) => void
  ) => React.ReactNode
}

export default function ProfileModalWrapper({
  address,
  children,
}: ProfileModalWrapperProps) {
  const [isOpenAccountModal, setIsOpenAccountModal] = useState(false)

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
