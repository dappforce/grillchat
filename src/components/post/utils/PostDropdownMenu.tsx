import FloatingMenus from '@/components/floating/FloatingMenus'
import { BsThreeDotsVertical } from 'react-icons/bs'

type PostDropdownMenuProps = {
  postId: string
}

const PostDropdownMenu = ({ postId }: PostDropdownMenuProps) => {
  const menu = [
    {
      text: 'Edit',
      onClick: () => console.log('Edit'),
    },
    {
      text: 'Delete',
      onClick: () => console.log('Delete'),
    },
  ]

  return (
    <FloatingMenus
      menus={menu}
      allowedPlacements={['bottom-start', 'bottom-end', 'bottom']}
      mainAxisOffset={20}
    >
      {(config) => {
        const { referenceProps, toggleDisplay } = config || {}

        return (
          <span
            className='cursor-pointer'
            {...referenceProps}
            onClick={toggleDisplay}
          >
            <BsThreeDotsVertical />
          </span>
        )
      }}
    </FloatingMenus>
  )
}

export default PostDropdownMenu
