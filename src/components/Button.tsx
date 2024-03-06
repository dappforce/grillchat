import { cx, interactionRingStyles } from '@/utils/class-names'
import { VariantProps, cva } from 'class-variance-authority'
import { ComponentProps, forwardRef } from 'react'
import Spinner from './Spinner'
import CustomLink, { CustomLinkProps } from './referral/CustomLink'

export const buttonStyles = cva('relative transition', {
  variants: {
    variant: {
      primary:
        'bg-background-primary border border-transparent text-text-on-primary',
      primaryOutline:
        'bg-transparent border border-background-primary/50 dark:border-background-primary/80 text-text',
      bgLighter:
        'bg-background-lighter border border-transparent text-text-muted',
      whiteOutline: 'bg-transparent border border-white text-text',
      mutedOutline: 'bg-transparent border border-text-muted text-text-muted',
      transparent: 'bg-transparent',
      redOutline: 'bg-transparent border border-text-red',
      landingPrimary:
        'bg-gradient-to-r from-[#DB4646] to-[#F9A11E] text-white hover:!ring-white/50 focus-visible:!ring-white/50',
      landingPrimaryOutline:
        'border border-[#DB4646] text-white hover:!ring-white/50 focus-visible:!ring-white/50',
    },
    roundings: {
      full: 'rounded-full',
      xl: 'rounded-xl',
      lg: 'rounded-lg',
    },
    disabledStyle: {
      default: '',
      subtle: '',
    },
    disabled: {
      true: '',
    },
    size: {
      noPadding: 'p-0',
      circle: 'p-2',
      circleSm: 'p-1',
      xs: 'px-3 py-1.5',
      sm: 'px-4 py-1.5',
      md: 'px-6 py-2',
      lg: 'px-8 py-3',
      xl: 'text-lg md:text-xl py-2.5 px-4 md:py-3 md:px-5',
    },
    interactive: {
      all: cx(
        // TODO: find solution why filter makes element move around in safari
        // 'hover:brightness-110 focus:brightness-110',
        interactionRingStyles()
      ),
      'brightness-only': cx(
        ''
        // 'hover:brightness-110 focus:brightness-110'
      ),
      none: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    interactive: 'all',
    disabledStyle: 'default',
    roundings: 'full',
  },
  compoundVariants: [
    {
      disabled: true,
      disabledStyle: 'default',
      class: cx(
        'opacity-30 dark:brightness-50 dark:opacity-100 pointer-events-none cursor-default'
      ),
    },
    {
      disabled: true,
      disabledStyle: 'subtle',
      class: cx('opacity-50 pointer-events-none cursor-default'),
    },
  ],
})

type ButtonPropsWithRef = VariantProps<typeof buttonStyles> &
  ComponentProps<'button'> &
  ComponentProps<'a'> & {
    withDisabledStyles?: boolean
    isLoading?: boolean
    loadingText?: string
    nextLinkProps?: Omit<CustomLinkProps, 'href'>
  }
export type ButtonProps = Omit<ButtonPropsWithRef, 'ref'>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    href,
    size,
    disabled: _disabled,
    withDisabledStyles = true,
    interactive,
    isLoading,
    children,
    nextLinkProps,
    loadingText = 'Loading',
    disabledStyle,
    roundings,
    type = 'button',
    ...props
  },
  ref
) {
  const disabled = _disabled || isLoading
  if (isLoading) {
    children = (
      <>
        <span className='invisible -z-10 opacity-0'>{children}</span>
        <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center'>
          <span className='mr-2 whitespace-nowrap'>{loadingText}</span>{' '}
          <Spinner className='h-4 w-4' />
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
      disabledStyle,
      roundings,
    }),
    'inline-block text-center',
    props.className
  )

  if (href) {
    return (
      <CustomLink
        className={className}
        ref={ref as any}
        {...nextLinkProps}
        {...props}
        href={href}
      >
        {children}
      </CustomLink>
    )
  }

  return (
    <button
      ref={ref}
      {...props}
      type={type}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  )
})
export default Button
