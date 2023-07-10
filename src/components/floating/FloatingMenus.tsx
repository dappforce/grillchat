import MenuList, { MenuListProps } from '../MenuList'
import FloatingWrapper, { FloatingWrapperProps } from './FloatingWrapper'

type FloatingMenuItemProps = {
  menus: MenuListProps['menus']
  closeMenu: () => void
}
export type FloatingMenusProps = Omit<FloatingWrapperProps, 'panel'> &
  Omit<FloatingMenuItemProps, 'closeMenu'> & {
    children: (
      config?: Parameters<FloatingWrapperProps['children']>[0]
    ) => JSX.Element
  }

export default function FloatingMenus({
  children,
  ...props
}: FloatingMenusProps) {
  if (props.menus.length === 0) {
    return children()
  }

  return (
    <FloatingWrapper
      {...props}
      panel={(closeMenu) => (
        <FloatingMenuPanel closeMenu={closeMenu} menus={props.menus} />
      )}
    >
      {children}
    </FloatingWrapper>
  )
}

function FloatingMenuPanel({ menus, closeMenu }: FloatingMenuItemProps) {
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
