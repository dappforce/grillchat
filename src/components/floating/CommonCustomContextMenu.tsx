import Button from '../Button'
import CustomContextMenu, { CustomContextMenuProps } from './CustomContextMenu'

export type CommonContextMenu = {
  text: string
  icon?: React.ReactNode
  onClick: () => void
}
type CommonContextMenuItemProps = {
  menus: CommonContextMenu[]
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
  return (
    <ul className='flex w-52 flex-col overflow-hidden rounded-lg bg-background-light py-1 shadow-[0_5px_50px_-12px_rgb(0,0,0,.25)] dark:shadow-[0_5px_50px_-12px_rgb(0,0,0)]'>
      {menus.map(({ onClick, text, icon }) => (
        <li key={text}>
          <Button
            onClick={() => {
              onClick()
              closeMenu()
            }}
            variant='transparent'
            size='noPadding'
            className='flex w-full items-center gap-4 rounded-none py-2 px-4 text-left transition focus:bg-background-lighter hover:bg-background-lighter'
            interactive='none'
          >
            {icon}
            {text}
          </Button>
        </li>
      ))}
    </ul>
  )
}
