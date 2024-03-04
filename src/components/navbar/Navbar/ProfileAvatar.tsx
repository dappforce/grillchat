import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import ProfileModal from '@/components/auth/ProfileModal'
import { useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { replaceUrl } from '@/utils/window'
import { ComponentProps, useEffect } from 'react'

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
  const address = useMyMainAddress()
  const openModal = useProfileModal((state) => state.openModal)

  useEffect(() => {
    const evmLinking = getUrlQuery('evmLinking')
    if (!evmLinking) return

    replaceUrl(getCurrentUrlWithoutQuery('evmLinking'))
    openModal({ defaultOpenState: 'link-evm-address' })
  }, [openModal])

  return (
    <>
      <div {...props} className={cx('relative h-8 w-8', props.className)}>
        <Button
          variant='primaryOutline'
          className='h-full w-full rounded-full border border-border-gray'
          size='noPadding'
          onClick={() => openModal()}
        >
          <AddressAvatar address={address ?? ''} className='h-full w-full' />
        </Button>
      </div>
      <ProfileModal />
    </>
  )
}
