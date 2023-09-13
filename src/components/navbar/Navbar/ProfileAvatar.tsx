import AddressAvatar from '@/components/AddressAvatar'
import ProfileModal from '@/components/auth/ProfileModal'
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
      <div {...props} className={cx('relative h-9 w-9', props.className)}>
        <AddressAvatar
          onClick={() => {
            setIsOpen(true)
          }}
          address={address}
          className='relative z-10 cursor-pointer'
        />
        <PopOver
          manualTrigger={popOverControl}
          popOverClassName='font-semibold cursor-pointer'
          yOffset={16}
          placement='bottom-end'
          panelColor='info'
          withCloseButton
          trigger={null}
          initialFocus={-1}
          onClose={() => sendEvent('close evm_linking_popover')}
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
    </>
  )
}
