import Button from '../Button'
import CustomContextMenu, { CustomContextMenuProps } from './CustomContextMenu'

type DefaultContextMenuProps = {
  menus: { text: string; icon?: React.ReactNode; onClick: () => void }[]
  closeMenu: () => void
}
export type CommonCustomContextMenuProps = Omit<
  CustomContextMenuProps,
  'menuPanel'
> &
  Omit<DefaultContextMenuProps, 'closeMenu'>

export default function CommonCustomContextMenu({
  children,
  allowedPlacements,
  ...props
}: CommonCustomContextMenuProps) {
  return (
    <CustomContextMenu
      menuPanel={(closeMenu) => (
        <CommonContextMenu closeMenu={closeMenu} {...props} />
      )}
      allowedPlacements={allowedPlacements}
    >
      {children}
    </CustomContextMenu>
  )
}

function CommonContextMenu({ menus, closeMenu }: DefaultContextMenuProps) {
  return (
    <ul className='flex w-52 flex-col overflow-hidden rounded-lg bg-background-light py-1 shadow-[0_5px_50px_-12px_rgb(0,0,0,.25)] dark:shadow-[0_5px_50px_-12px_rgb(0,0,0)]'>
      {menus.map(({ onClick, text, icon }) => (
        <li
          className='py-2 px-4 transition focus:bg-background-lighter hover:bg-background-lighter'
          key={text}
        >
          <Button
            onClick={() => {
              onClick()
              closeMenu()
            }}
            variant='transparent'
            size='noPadding'
            className='flex w-full items-center gap-4 text-left'
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
