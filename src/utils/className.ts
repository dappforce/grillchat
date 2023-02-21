import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cx(...params: Parameters<typeof clsx>) {
  return twMerge(clsx(params))
}
