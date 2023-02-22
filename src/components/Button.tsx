import { cx } from '@/utils/className'
import { cva, VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { ComponentProps } from 'react'

const buttonStyles = cva('rounded-full px-6 py-2', {
  variants: {
    variant: {
      primary: 'font-medium bg-background-primary text-text',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

export type ButtonProps = VariantProps<typeof buttonStyles> &
  ComponentProps<'button'> &
  ComponentProps<'a'>

export default function Button({ variant, href, ...props }: ButtonProps) {
  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a
          {...props}
          className={cx(buttonStyles({ variant, className: props.className }))}
        />
      </Link>
    )
  }

  return (
    <button
      {...props}
      className={cx(buttonStyles({ variant, className: props.className }))}
    />
  )
}
