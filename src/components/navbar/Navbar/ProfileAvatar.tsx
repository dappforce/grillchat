import AddressAvatar from '@/components/AddressAvatar'
import ProfileModal from '@/components/auth/ProfileModal'
import Button from '@/components/Button'
import useIsModerationAdmin from '@/hooks/useIsModerationAdmin'
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
  const isAdmin = useIsModerationAdmin()
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
      </div>
      <ProfileModal />
    </>
  )
}
