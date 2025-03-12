import FloatingMenus from '@/components/floating/FloatingMenus'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types/dto'
import { isDef } from '@subsocial/utils'
import { BsThreeDotsVertical } from 'react-icons/bs'

type SpaceDropdownMenuProps = {
  postData: PostData
  className?: string
}

const PostDropdownMenu = (props: SpaceDropdownMenuProps) => {
  const {
    postData: { struct },
    className,
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
            href: `space/${id}/edit`,
          }
        : undefined,
      !isMySpace || isHidden
        ? undefined
        : { text: 'Write post', href: `/${id}/posts/new` },
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
            onClick={toggleDisplay}
            className={cx(
              'flex cursor-pointer items-center gap-1 text-text-primary',
              className
            )}
          >
            <BsThreeDotsVertical />
          </div>
        )
      }}
    </FloatingMenus>
  )
}

export default PostDropdownMenu
