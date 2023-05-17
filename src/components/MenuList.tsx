import { cx } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import React, { ComponentProps, isValidElement } from 'react'
import Button from './Button'

type MenuListVariants = {
  size: {
    md: string
    sm: string
  }
}
const menuListStyles = cva<MenuListVariants>('flex w-full flex-col', {
  variants: {
    size: {
      md: 'p-3',
      sm: 'p-1.5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
const menuListItemStyles = cva<MenuListVariants>(
  cx(
    'relative flex items-center rounded-lg outline-none transition-colors',
    'focus:bg-background-lighter hover:bg-background-lighter'
  ),
  {
    variants: {
      size: {
        md: 'px-6 py-3 gap-6',
        sm: 'px-3 py-2 gap-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

type Menu = {
  text: string | JSX.Element
  icon: React.ComponentType<{ className?: string }>
  onClick?: () => void
  href?: string
}
export type MenuListProps = ComponentProps<'div'> &
  VariantProps<typeof menuListStyles> & {
    menus: Menu[]
  }

export default function MenuList({ menus, size, ...props }: MenuListProps) {
  return (
    <div {...props} className={cx(menuListStyles({ size }), props.className)}>
      {menus.map(({ icon: Icon, onClick, text, href }, idx) => (
        <Button
          key={idx}
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          variant='transparent'
          size='noPadding'
          interactive='none'
          className={menuListItemStyles({ size })}
          onClick={onClick}
        >
          <Icon className='text-xl text-text-muted' />
          {isValidElement(text) ? text : <span>{text}</span>}
        </Button>
      ))}
    </div>
  )
}
