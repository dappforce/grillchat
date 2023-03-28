import { cx, interactionRingStyles } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { ComponentProps } from 'react'

export const buttonStyles = cva(
  'rounded-full transition hover:brightness-110',
  {
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
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export type ButtonProps = VariantProps<typeof buttonStyles> &
  ComponentProps<'button'> &
  ComponentProps<'a'> & {
    withDisabledStyles?: boolean
    withRingInteraction?: boolean
  }

export default function Button({
  variant,
  href,
  size,
  disabled,
  withDisabledStyles = true,
  withRingInteraction = true,
  ...props
}: ButtonProps) {
  const classNames = cx(
    withRingInteraction &&
      interactionRingStyles({ color: 'background', variant: 'small-offset' }),
    buttonStyles({ variant, size, disabled: disabled && withDisabledStyles }),
    'inline-block text-center',
    props.className
  )

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a {...props} className={classNames} />
      </Link>
    )
  }

  return <button {...props} disabled={disabled} className={classNames} />
}
