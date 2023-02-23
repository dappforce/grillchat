import AddressAvatar from '@/components/AddressAvatar'
import PopOver from '@/components/PopOver'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import ProfileModal from './ProfileModal'

export type ProfileAvatarProps = ComponentProps<'div'> & {
  address: string
}

export default function ProfileAvatar({ address }: ProfileAvatarProps) {
  const popOverTriggerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const hasOpened = useRef(false)
  useEffect(() => {
    if (!hasOpened.current) {
      if (!popOverTriggerRef.current) return
      popOverTriggerRef.current.click()
      hasOpened.current = true
    }
  }, [])

  return (
    <>
      <ProfileModal
        address={address}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
      <div className='relative h-9 w-9'>
        <AddressAvatar
          onClick={() => setIsOpen(true)}
          address={address}
          className='relative z-10'
        />
        <PopOver
          yOffset={16}
          placement='bottom-end'
          panelColor='warning'
          withCloseButton
          trigger={
            <AddressAvatar
              ref={popOverTriggerRef}
              className='pointer-events-none absolute inset-0 hidden'
              address={address}
            />
          }
        >
          <p>Click on your avatar and save your private key</p>
        </PopOver>
      </div>
    </>
  )
}
