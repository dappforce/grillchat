import { cx } from '@/utils/class-names'
import { useState } from 'react'
import Name, { NameProps } from './Name'
import ProfilePreview from './ProfilePreview'
import ProfilePostsListModalWrapper from './chats/ChatItem/ProfileProstsListModal'
import Modal from './modals/Modal'

export type ProfilePreviewModalWrapperProps = {
  address: string
  messageId?: string
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
        <ProfilePreview asLink address={address} className='mb-2' />
      </Modal>
    </>
  )
}

export function ProfilePreviewModalName({
  messageId,
  ...props
}: NameProps & { messageId?: string }) {
  return (
    <ProfilePostsListModalWrapper address={props.address}>
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
    </ProfilePostsListModalWrapper>
  )
}
