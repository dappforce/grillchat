import FloatingMenus from '@/components/floating/FloatingMenus'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useMyMainAddress } from '@/stores/my-account'
import { SpaceData } from '@subsocial/api/types'
import { isDef } from '@subsocial/utils'
import { BsThreeDotsVertical } from 'react-icons/bs'

type SpaceDropdownMenuProps = {
  spaceData: SpaceData
}

const SpaceDropdownMenu = (props: SpaceDropdownMenuProps) => {
  const {
    spaceData: { struct },
  } = props
  const { id, ownerId } = struct
  const spaceKey = `space-${id.toString()}`
  const address = useMyMainAddress()
  const isMySpace = struct.ownerId === address
  const { data: profileData } = getProfileQuery.useQuery(address || '')

  const { profileSpace } = profileData || {}

  const profileSpaceId = profileSpace?.id

  const isHidden = struct.hidden

  const showMakeAsProfileButton =
    isMySpace && (!profileSpaceId || profileSpaceId !== id)

  const getMenuItems = () => {
    return [
      isMySpace
        ? {
            text: 'Edit space',
            href: `/space/${id}/edit`,
          }
        : undefined,
      !isMySpace || isHidden
        ? undefined
        : { text: 'Write post', href: `/space/${id}/posts/new` },
      showMakeAsProfileButton ? { text: 'Make as profile' } : undefined,
      isMySpace && profileSpaceId === id
        ? { text: 'Unlink profile' }
        : undefined,
      isMySpace
        ? { text: isHidden ? 'Hide space' : 'Unhide space' }
        : undefined,
      {
        text: `Copy space id`,
        onClick: () => {
          navigator.clipboard.writeText(id)
        },
      },
      {
        text: 'Copy owner address',
        onClick: () => navigator.clipboard.writeText(ownerId),
      },
    ]
  }

  return (
    <FloatingMenus
      menus={getMenuItems().filter(isDef)}
      allowedPlacements={['bottom-start']}
      mainAxisOffset={4}
      panelSize='xs'
    >
      {(config) => {
        const { referenceProps, toggleDisplay } = config || {}
        return (
          <div
            {...referenceProps}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              toggleDisplay?.()
            }}
            className='flex cursor-pointer items-center gap-1 text-text-primary'
          >
            <BsThreeDotsVertical />
          </div>
        )
      }}
    </FloatingMenus>
  )
}

export default SpaceDropdownMenu
