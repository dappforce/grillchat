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
  cx(
    'disabled:hover:ring-0 disabled:ring-offset-0 hover:ring-1 focus-visible:ring-1 hover:ring-background-primary/60 focus-visible:ring-background-primary/60 focus-visible:outline-none'
  ),
  {
    variants: {},
    defaultVariants: {},
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

const COMMON_CLASS_NAMES = {
  chatImageBackground: cx(
    'overflow-hidden rounded-full bg-background-light bg-gradient-to-b from-[#E0E7FF] to-[#A5B4FC] object-cover'
  ),
  donateMessagePreviewBg: cx('bg-gradient-to-br from-[#C43333] to-[#F9A11E]'),
}
export function getCommonClassNames(type: keyof typeof COMMON_CLASS_NAMES) {
  return COMMON_CLASS_NAMES[type]
}
