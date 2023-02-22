import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cx(...params: Parameters<typeof clsx>) {
  return twMerge(clsx(params))
}

export const hoverRingClassName = cx(
  'ring-offset-background-light',
  'hover:ring-1 hover:ring-offset-0',
  'focus-within:!ring-2 focus-within:ring-offset-0 focus-within:outline-none',
  'disabled:hover:ring-0 disabled:ring-offset-0'
)
