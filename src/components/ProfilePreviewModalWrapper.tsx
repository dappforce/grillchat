import { cx } from '@/utils/class-names'
import { useState } from 'react'
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
