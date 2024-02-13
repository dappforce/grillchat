import AddressAvatar from '@/components/AddressAvatar'
import ProfileModal from '@/components/auth/ProfileModal'
import Button from '@/components/Button'
import PopOver from '@/components/floating/PopOver'
import useIsModerationAdmin from '@/hooks/useIsModerationAdmin'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { replaceUrl } from '@/utils/window'
import { ComponentProps, useEffect, useState } from 'react'

export type ProfileAvatarProps = ComponentProps<'div'> & {
  popOverControl?: {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
}

export default function ProfileAvatar({
  popOverControl,
  ...props
}: ProfileAvatarProps) {
  const isAdmin = useIsModerationAdmin()
  const address = useMyMainAddress()
  const openModal = useProfileModal((state) => state.openModal)

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
    openModal({ defaultOpenState: 'link-evm-address' })
  }, [openModal])

  return (
    <>
      <div {...props} className={cx('relative', props.className)}>
        <Button
          className={cx(
            'relative z-10 flex items-center gap-2 py-1.5 pl-2 pr-3',
            isAdmin && 'bg-orange-600 dark:bg-orange-700'
          )}
          variant={isAdmin ? 'primary' : 'primaryOutline'}
          onClick={() => openModal()}
        >
          <AddressAvatar address={address ?? ''} className='h-6 w-6' />
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
              openModal({ defaultOpenState: 'link-evm-address' })
            },
          }}
        >
          <p>Connect an EVM wallet to unlock more features</p>
        </PopOver>
      </div>
      <ProfileModal
        notification={{
          showNotif: showNotif,
          setNotifDone: () => setShowNotif(false),
        }}
      />
    </>
  )
}
