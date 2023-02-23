import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import CopyText from '@/components/CopyText'
import Modal from '@/components/Modal'
import PopOver from '@/components/PopOver'
import { ComponentProps, useEffect, useRef, useState } from 'react'

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
      <Modal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        title={<span className='font-medium'>My Account</span>}
        withCloseButton
      >
        <div className='mt-2 flex flex-col items-center gap-4'>
          <AddressAvatar address={address} className='h-20 w-20' />
          <CopyText text={address} />
          <Button className='mt-2 w-full' size='lg'>
            Show private key
          </Button>
          <Button className='w-full' size='lg' variant='primaryOutline'>
            Log out
          </Button>
        </div>
      </Modal>
      <div className='relative h-9 w-9'>
        <AddressAvatar
          onClick={() => setIsOpen(true)}
          address={address}
          className='relative z-10'
        />
        <PopOver
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
