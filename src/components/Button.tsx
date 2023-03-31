import { cx, interactionRingStyles } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { ComponentProps } from 'react'
import Spinner from './Spinner'

export const buttonStyles = cva('rounded-full transition', {
  variants: {
    variant: {
      primary: 'bg-background-primary border border-transparent text-text',
      primaryOutline:
        'bg-transparent border border-background-primary text-text',
      mutedOutline: 'bg-transparent border border-text-muted text-text-muted',
      transparent: 'bg-transparent text-text',
    },
    disabled: {
      true: 'brightness-50 pointer-events-none cursor-default',
    },
    size: {
      noPadding: 'p-0',
      circle: 'p-2',
      md: 'px-6 py-2',
      lg: 'px-8 py-3',
    },
    interactive: {
      all: cx(
        'hover:brightness-110 focus:brightness-110',
        interactionRingStyles({ color: 'background', variant: 'small-offset' })
      ),
      'brightness-only': cx('hover:brightness-110 focus:brightness-110'),
      none: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    interactive: 'all',
  },
})

export type ButtonProps = VariantProps<typeof buttonStyles> &
  ComponentProps<'button'> &
  ComponentProps<'a'> & {
    withDisabledStyles?: boolean
    isLoading?: boolean
  }

export default function Button({
  variant,
  href,
  size,
  disabled: _disabled,
  withDisabledStyles = true,
  interactive,
  isLoading,
  children,
  ...props
}: ButtonProps) {
  const disabled = _disabled || isLoading
  if (isLoading) {
    children = (
      <>
        <span className='opacity-0'>{children}</span>
        <div className='absolute top-1/2 left-1/2 flex -translate-y-1/2 -translate-x-1/2 items-center'>
          <span className='mr-2'>Loading</span> <Spinner className='h-6 w-6' />
        </div>
      </>
    )
  }

  const className = cx(
    buttonStyles({
      variant,
      size,
      disabled: disabled && withDisabledStyles,
      interactive,
    }),
    'inline-block text-center',
    props.className
  )

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a {...props} className={className}>
          {children}
        </a>
      </Link>
    )
  }

  return (
    <button {...props} disabled={disabled} className={className}>
      {children}
    </button>
  )
}
