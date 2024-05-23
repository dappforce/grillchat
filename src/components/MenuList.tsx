import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import { cx } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import React, { ComponentProps, isValidElement, SyntheticEvent } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { Drawer } from 'vaul'
import Button from './Button'
import FloatingMenus from './floating/FloatingMenus'

type MenuListVariants = {
  size: {
    md: string
    sm: string
    xs: string
  }
}
const menuListStyles = cva<MenuListVariants>('flex w-full flex-col', {
  variants: {
    size: {
      md: 'p-3',
      sm: 'p-1.5',
      xs: 'p-1',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
const menuListItemStyles = cva<MenuListVariants>(
  cx(
    'relative flex items-center rounded-lg outline-none transition-colors',
    'focus-visible:bg-background-lighter hover:bg-background-lighter'
  ),
  {
    variants: {
      size: {
        md: 'px-4 py-3 gap-5',
        sm: 'px-3 py-2 gap-4',
        xs: 'px-2 py-1.5 gap-2',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

type Menu = {
  text: string | JSX.Element
  iconClassName?: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: (e: SyntheticEvent) => void
  href?: string
  disabled?: boolean
  className?: string
  submenus?: Menu[]
}
export type MenuListProps = ComponentProps<'div'> &
  VariantProps<typeof menuListStyles> & {
    menus: Menu[]
  }

export default function MenuList({ menus, size, ...props }: MenuListProps) {
  return (
    <div {...props} className={cx(menuListStyles({ size }), props.className)}>
      {menus.map((menu, idx) => (
        <MenuButton key={idx} menu={menu} size={size} />
      ))}
    </div>
  )
}

function MenuButton({
  menu,
  size,
}: { menu: Menu } & VariantProps<typeof menuListItemStyles>) {
  const mdUp = useBreakpointThreshold('md')
  const {
    text,
    className,
    disabled,
    href,
    icon: Icon,
    iconClassName,
    onClick,
    submenus,
  } = menu

  const button = (withArrow?: boolean) => (
    <Button
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      variant='transparent'
      size='noPadding'
      disabled={disabled}
      interactive='none'
      className={cx(
        menuListItemStyles({ size }),
        'w-full text-left',
        className
      )}
      disabledStyle='subtle'
      onClick={onClick}
    >
      {Icon && (
        <Icon
          className={cx(
            'flex-shrink-0 text-[1.25em] text-text-muted',
            iconClassName
          )}
        />
      )}
      {isValidElement(text) ? text : <span>{text}</span>}
      {withArrow && (
        <FiChevronRight className='ml-auto text-[1.25em] text-text-muted' />
      )}
    </Button>
  )

  if (submenus) {
    if (mdUp) {
      return (
        <FloatingMenus menus={submenus} showOnHover placement='right-start'>
          {(config) => (
            <div
              {...config?.referenceProps}
              onClick={() => {
                config?.toggleDisplay()
              }}
            >
              {button(true)}
            </div>
          )}
        </FloatingMenus>
      )
    } else {
      return (
        <Drawer.Root shouldScaleBackground>
          <Drawer.Trigger asChild>{button(true)}</Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className='fixed inset-0 z-40 bg-black/40' />
            <Drawer.Content className='fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background-light'>
              <div className='mx-auto mt-4 h-2 w-[100px] rounded-full bg-background-lightest' />
              <div className='mt-2 flex flex-col gap-1'>
                <span className='px-6 font-semibold'>Share to:</span>
                <MenuList menus={submenus} className='p-2' />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )
    }
  }

  return button()
}
