import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import { CSSProperties } from 'react'
import { twMerge } from 'tailwind-merge'

export function getBlurFallbackStyles(): CSSProperties {
  return {
    backfaceVisibility: 'hidden',
    MozBackfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: 'translate3d(0, 0, 0)',
    msTransform: 'translate3d(0, 0, 0)',
    WebkitTransform: 'translate3d(0, 0, 0)',
  }
}

export function cx(...params: Parameters<typeof clsx>) {
  return twMerge(clsx(params))
}

export const interactionRingStyles = cva(
  'disabled:hover:ring-0 disabled:ring-offset-0 hover:ring-1 focus-visible:!ring-2 focus-visible:outline-none',
  {
    variants: {
      color: {
        'background-light': cx('ring-offset-background-light'),
        background: cx('ring-offset-background'),
      },
      variant: {
        'no-offset': cx('focus-visible:ring-offset-0 hover:ring-offset-0'),
        'small-offset': cx('focus-visible:ring-offset-2 hover:ring-offset-2'),
      },
    },
    defaultVariants: {
      color: 'background-light',
      variant: 'no-offset',
    },
  }
)

export const scrollBarStyles = cva('', {
  variants: {
    none: {
      true: cx('scrollbar-none'),
      false: cx('flex-1 overflow-auto'),
    },
  },
  defaultVariants: {
    none: false,
  },
})
