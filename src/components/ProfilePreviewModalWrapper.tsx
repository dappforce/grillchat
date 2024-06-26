import { cx } from '@/utils/class-names'
import { useState } from 'react'
import { RiCopperCoinLine } from 'react-icons/ri'
import ActionCard from './ActionCard'
import Name, { NameProps } from './Name'
import ProfilePreview from './ProfilePreview'
import { useOpenDonateExtension } from './extensions/donate/hooks/useOpenDonateExtension'
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
  messageId,
  children,
}: ProfilePreviewModalWrapperProps) {
  const openDonateExtension = useOpenDonateExtension(messageId ?? '', address)
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
        {messageId && (
          <ActionCard
            className='mt-2'
            actions={[
              {
                icon: RiCopperCoinLine,
                text: 'Donate',
                iconClassName: cx('text-text-muted'),
                onClick: () => openDonateExtension(),
              },
            ]}
          />
        )}
      </Modal>
    </>
  )
}

export function ProfilePreviewModalName({
  messageId,
  ...props
}: NameProps & { messageId?: string }) {
  return (
    <ProfilePreviewModalWrapper address={props.address} messageId={messageId}>
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
