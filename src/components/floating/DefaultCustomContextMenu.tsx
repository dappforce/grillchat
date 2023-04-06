import CustomContextMenu, { CustomContextMenuProps } from './CustomContextMenu'

export type DefaultCustomContextMenuProps = Omit<
  CustomContextMenuProps,
  'menuPanel'
>

export default function DefaultCustomContextMenu({
  children,
}: DefaultCustomContextMenuProps) {
  return (
    <CustomContextMenu menuPanel={<DefaultContextMenu />}>
      {children}
    </CustomContextMenu>
  )
}

function DefaultContextMenu() {
  return (
    <div className='bg-background-light shadow-2xl'>sdfadasfgadsasdfsd</div>
  )
}
