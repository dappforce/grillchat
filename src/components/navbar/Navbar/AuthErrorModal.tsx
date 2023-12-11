import Button from '@/components/Button'
import Modal from '@/components/modals/Modal'
import ProfilePreview from '@/components/ProfilePreview'
import { getUrlQuery } from '@/utils/links'
import { useEffect, useState } from 'react'

export default function AuthErrorModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [blockedAddress, setBlockedAddress] = useState('')

  useEffect(() => {
    const blockedAddress = getUrlQuery('auth-blocked')
    if (blockedAddress) {
      setIsOpen(true)
      setBlockedAddress(blockedAddress)
    }
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      title='🚫 Your account was banned'
      withCloseButton
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col rounded-2xl bg-background-lighter p-4'>
          <ProfilePreview address={blockedAddress} />
        </div>
        <div className='flex flex-col rounded-2xl bg-background-lighter p-4'>
          <span className='mb-1 text-sm text-text-muted'>Reason for ban</span>
          <span>You are stupid</span>
          {/* TODO: add href to google forms */}
          <Button className='mt-4' variant='primaryOutline' size='lg'>
            Contact support
          </Button>
        </div>
      </div>
    </Modal>
  )
}
