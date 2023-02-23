import { cx } from '@/utils/className'
import { cva, VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { ComponentProps } from 'react'

const buttonStyles = cva('rounded-full', {
  variants: {
    variant: {
      primary: 'bg-background-primary text-text',
      primaryOutline:
        'bg-transparent border border-background-primary text-text',
      transparent: 'bg-transparent text-text',
    },
    size: {
      noPadding: 'p-0',
      circle: 'p-2',
      md: 'px-6 py-2',
      lg: 'px-8 py-3',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type ButtonProps = VariantProps<typeof buttonStyles> &
  ComponentProps<'button'> &
  ComponentProps<'a'>

export default function Button({ variant, href, size, ...props }: ButtonProps) {
  const classNames = cx(buttonStyles({ variant, size }), props.className)

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a {...props} className={classNames} />
      </Link>
    )
  }

  return <button {...props} className={classNames} />
}
