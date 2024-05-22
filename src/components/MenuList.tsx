import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import { cx } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import React, { ComponentProps, isValidElement, SyntheticEvent } from 'react'
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

  const button = (additionalProps?: { onClick?: () => void }) => (
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
      onClick={(e) => {
        additionalProps?.onClick?.()
        onClick?.(e)
      }}
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
              {button()}
            </div>
          )}
        </FloatingMenus>
      )
    } else {
      return button({
        onClick: () => {
          // TODO: Implement mobile menu
          console.log('open')
        },
      })
    }
  }

  return button()
}
