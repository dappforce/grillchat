import MenuList, { MenuListProps } from '../MenuList'
import CustomContextMenu, { CustomContextMenuProps } from './CustomContextMenu'

type CommonContextMenuItemProps = {
  menus: MenuListProps['menus']
  closeMenu: () => void
}
export type CommonCustomContextMenuProps = Omit<
  CustomContextMenuProps,
  'menuPanel'
> &
  Omit<CommonContextMenuItemProps, 'closeMenu'>

export default function CommonCustomContextMenu({
  children,
  allowedPlacements,
  ...props
}: CommonCustomContextMenuProps) {
  if (props.menus.length === 0) {
    return children()
  }

  return (
    <CustomContextMenu
      menuPanel={(closeMenu) => (
        <CommonContextMenuItem closeMenu={closeMenu} {...props} />
      )}
      allowedPlacements={allowedPlacements}
    >
      {children}
    </CustomContextMenu>
  )
}

function CommonContextMenuItem({
  menus,
  closeMenu,
}: CommonContextMenuItemProps) {
  const augmentedMenus = menus.map((menu) => ({
    ...menu,
    onClick: () => {
      menu.onClick?.()
      closeMenu()
    },
  }))

  return (
    <MenuList
      size='sm'
      className='w-52 overflow-hidden rounded-lg bg-background-light shadow-[0_5px_50px_-12px_rgb(0,0,0,.25)] dark:shadow-[0_5px_50px_-12px_rgb(0,0,0)]'
      menus={augmentedMenus}
    />
  )
}
