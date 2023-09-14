import AddressAvatar from '@/components/AddressAvatar'
import ProfileModal from '@/components/auth/ProfileModal'
import Button from '@/components/Button'
import PopOver from '@/components/floating/PopOver'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { replaceUrl } from '@/utils/window'
import { ComponentProps, useEffect, useState } from 'react'

export type ProfileAvatarProps = ComponentProps<'div'> & {
  address: string
  popOverControl?: {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
}

export default function ProfileAvatar({
  address,
  popOverControl,
  ...props
}: ProfileAvatarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [directlyOpenEvmLinking, setDirectlyOpenEvmLinking] = useState(false)

  const [showNotif, setShowNotif] = useState(false)
  const sendEvent = useSendEvent()

  useEffect(() => {
    if (popOverControl?.isOpen) {
      setShowNotif(true)
    }
  }, [popOverControl?.isOpen])

  useEffect(() => {
    const evmLinking = getUrlQuery('evmLinking')
    if (!evmLinking) return

    replaceUrl(getCurrentUrlWithoutQuery('evmLinking'))
    setDirectlyOpenEvmLinking(true)
    setIsOpen(true)
  }, [])

  return (
    <>
      <div {...props} className={cx('relative', props.className)}>
        <Button
          className='relative z-10 flex items-center gap-2 py-1.5 pl-2 pr-3'
          variant='primaryOutline'
          onClick={() => {
            setIsOpen(true)
          }}
        >
          <AddressAvatar address={address} className='h-6 w-6' />
          <span className='text-sm'>Account</span>
        </Button>
        <PopOver
          manualTrigger={popOverControl}
          popOverClassName='font-semibold cursor-pointer'
          popOverContainerClassName='z-30'
          yOffset={16}
          placement='bottom-end'
          panelColor='info'
          withCloseButton
          trigger={null}
          initialFocus={-1}
          onClose={() => sendEvent('evm_linking_popover_closed')}
          popOverProps={{
            onClick: () => {
              sendEvent('evm_linking_popover_clicked')
              setDirectlyOpenEvmLinking(true)
              setIsOpen(true)
            },
          }}
        >
          <p>Connect an EVM wallet to unlock more features</p>
        </PopOver>
      </div>
      <ProfileModal
        address={address}
        isOpen={isOpen}
        step={directlyOpenEvmLinking ? 'link-evm-address' : undefined}
        closeModal={() => {
          setIsOpen(false)
          setDirectlyOpenEvmLinking(false)
        }}
        notification={{
          showNotif: showNotif,
          setNotifDone: () => setShowNotif(false),
        }}
      />
    </>
  )
}
