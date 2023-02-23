import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cx(...params: Parameters<typeof clsx>) {
  return twMerge(clsx(params))
}

export const interactionRingStyles = cva(
  'disabled:hover:ring-0 disabled:ring-offset-0 hover:ring-1 focus-within:!ring-2 focus-within:outline-none',
  {
    variants: {
      color: {
        'background-light': cx('ring-offset-background-light'),
        background: cx('ring-offset-background'),
      },
      variant: {
        'no-offset': cx('focus-within:ring-offset-0 hover:ring-offset-0'),
        'small-offset': cx('focus-within:ring-offset-2 hover:ring-offset-2'),
      },
    },
    defaultVariants: {
      color: 'background-light',
      variant: 'no-offset',
    },
  }
)
