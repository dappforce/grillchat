import { cx } from '@/utils/class-names'
import React, { ComponentProps, isValidElement } from 'react'
import Button from './Button'

type Menu = {
  text: string | JSX.Element
  icon: React.ComponentType<{ className?: string }>
  onClick?: () => void
  href?: string
}
export type MenuListProps = ComponentProps<'div'> & {
  menus: Menu[]
}

export default function MenuList({ menus }: MenuListProps) {
  return (
    <div className='flex w-full flex-col p-3'>
      {menus.map(({ icon: Icon, onClick, text, href }, idx) => (
        <Button
          key={idx}
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          variant='transparent'
          size='noPadding'
          interactive='none'
          className={cx(
            'relative flex items-center rounded-lg px-6 py-3 outline-none transition-colors',
            'focus:bg-background-lighter hover:bg-background-lighter'
          )}
          onClick={onClick}
        >
          <Icon className='mr-6 text-xl text-text-muted' />
          {isValidElement(text) ? text : <span>{text}</span>}
        </Button>
      ))}
    </div>
  )
}
