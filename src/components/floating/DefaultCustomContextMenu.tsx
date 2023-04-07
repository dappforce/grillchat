import Button from '../Button'
import CustomContextMenu, { CustomContextMenuProps } from './CustomContextMenu'

type DefaultContextMenuProps = {
  menus: { text: string; icon?: React.ReactNode; onClick: () => void }[]
  closeMenu: () => void
}
export type DefaultCustomContextMenuProps = Omit<
  CustomContextMenuProps,
  'menuPanel'
> &
  Omit<DefaultContextMenuProps, 'closeMenu'>

export default function DefaultCustomContextMenu({
  children,
  ...props
}: DefaultCustomContextMenuProps) {
  return (
    <CustomContextMenu
      menuPanel={(closeMenu) => (
        <DefaultContextMenu closeMenu={closeMenu} {...props} />
      )}
    >
      {children}
    </CustomContextMenu>
  )
}

function DefaultContextMenu({ menus, closeMenu }: DefaultContextMenuProps) {
  return (
    <ul className='flex w-28 flex-col rounded-lg bg-background-light py-1 shadow-[0_5px_50px_-12px_rgb(0,0,0)]'>
      {menus.map((menu) => (
        <li
          className='py-2 px-4 transition focus:bg-background-lighter hover:bg-background-lighter'
          key={menu.text}
        >
          <Button
            onClick={() => {
              menu.onClick()
              closeMenu()
            }}
            variant='transparent'
            size='noPadding'
            className='w-full text-left'
            interactive='none'
          >
            {menu.text}
          </Button>
        </li>
      ))}
    </ul>
  )
}
