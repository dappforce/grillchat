import AddressAvatar from '@/components/AddressAvatar'
import PopOver from '@/components/floating/PopOver'
import { cx } from '@/utils/class-names'
import { ComponentProps, useEffect, useState } from 'react'
import ProfileModal from './ProfileModal'

export type ProfileAvatarProps = ComponentProps<'div'> & {
  address: string
  avatar: string
  popOverControl?: {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
}

export default function ProfileAvatar({
  address,
  popOverControl,
  avatar,
  ...props
}: ProfileAvatarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  useEffect(() => {
    if (popOverControl?.isOpen) {
      setShowNotif(true)
    }
  }, [popOverControl?.isOpen])

  return (
    <>
      <ProfileModal
        address={address}
        isOpen={isOpen}
        avatar={avatar}
        closeModal={() => setIsOpen(false)}
        notification={{
          showNotif: showNotif,
          setNotifDone: () => setShowNotif(false),
        }}
      />
      <div {...props} className={cx('relative h-9 w-9', props.className)}>
        <AddressAvatar
          onClick={() => setIsOpen(true)}
          address={address}
          avatar={avatar}
          className='relative z-10 cursor-pointer'
        />
        <PopOver
          manualTrigger={popOverControl}
          popOverClassName='font-semibold'
          yOffset={16}
          placement='bottom-end'
          panelColor='warning'
          withCloseButton
          trigger={null}
          initialFocus={-1}
        >
          <p>Click on your avatar and save your Grill secret key</p>
        </PopOver>
      </div>
    </>
  )
}
