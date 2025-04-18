import FloatingMenus from '@/components/floating/FloatingMenus'
import { getPostQuery } from '@/services/api/query'
import { useHideUnhidePost } from '@/services/subsocial/posts/mutation'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types/dto'
import { isDef } from '@subsocial/utils'
import { useQueryClient } from '@tanstack/react-query'
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
  const address = useMyMainAddress()
  const client = useQueryClient()
  const isMyPost = struct.ownerId === address
  const { mutateAsync } = useHideUnhidePost({
    onSuccess: () => {
      getPostQuery.invalidate(client, id)
    },
  })

  const isHidden = struct.hidden

  const getMenuItems = () => {
    return [
      isMyPost
        ? {
            text: 'Edit post',
            href: `/space/${struct.spaceId}/${id}/edit`,
          }
        : undefined,
      isMyPost
        ? {
            text: isHidden ? 'Unhide post' : 'Hide post',
            onClick: async (e: any) => {
              e.preventDefault()
              e.stopPropagation()

              await mutateAsync({
                postId: id,
                action: isHidden ? 'unhide' : 'hide',
              })
            },
          }
        : undefined,
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
