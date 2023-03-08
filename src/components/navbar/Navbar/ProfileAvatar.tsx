import AddressAvatar from '@/components/AddressAvatar'
import PopOver from '@/components/PopOver'
import { cx } from '@/utils/className'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import ProfileModal from './ProfileModal'

export type ProfileAvatarProps = ComponentProps<'div'> & {
  address: string
  displayPopOver?: boolean
}

export default function ProfileAvatar({
  address,
  displayPopOver,
  ...props
}: ProfileAvatarProps) {
  const popOverTriggerRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const prevAccountPopOverOpened = useRef('')

  useEffect(() => {
    if (prevAccountPopOverOpened.current === address) return
    prevAccountPopOverOpened.current = address

    if (displayPopOver) {
      if (!popOverTriggerRef.current) return
      popOverTriggerRef.current?.click()
    }
  }, [displayPopOver, address])

  return (
    <>
      <ProfileModal
        address={address}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
      <div {...props} className={cx('relative h-9 w-9', props.className)}>
        <AddressAvatar
          onClick={() => setIsOpen(true)}
          address={address}
          className='relative z-10 cursor-pointer'
        />
        <PopOver
          popOverClassName='font-bold'
          yOffset={16}
          placement='bottom-end'
          panelColor='warning'
          withCloseButton
          trigger={<div ref={popOverTriggerRef} />}
        >
          <p>Click on your avatar and save your private key</p>
        </PopOver>
      </div>
    </>
  )
}
