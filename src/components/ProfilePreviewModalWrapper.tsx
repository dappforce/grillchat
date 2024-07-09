import { cx } from '@/utils/class-names'
import { useState } from 'react'
import Name, { NameProps } from './Name'
import ProfilePreview from './ProfilePreview'
import ProfilePostsListModalWrapper from './chats/ChatItem/profilePosts/ProfileProstsListModal'
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
  chatId,
  hubId,
  enableProfileModal = true,
  ...props
}: NameProps & {
  messageId: string
  chatId: string
  hubId: string
  enableProfileModal?: boolean
}) {
  return (
    <ProfilePostsListModalWrapper
      address={props.address}
      messageId={messageId}
      chatId={chatId}
      hubId={hubId}
    >
      {(onClick) => (
        <Name
          {...props}
          onClick={(e) => {
            if (enableProfileModal) {
              onClick(e)
              props.onClick?.(e)
            }
          }}
          className={cx('cursor-pointer', props.className)}
          address={props.address}
        />
      )}
    </ProfilePostsListModalWrapper>
  )
}
