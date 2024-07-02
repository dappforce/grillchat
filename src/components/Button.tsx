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
        'bg-transparent border border-background-primary/70 text-text',
      bgLighter:
        'bg-background-light border border-transparent text-text-muted',
      whiteOutline: 'bg-transparent border border-white text-text !ring-white',
      white: 'bg-white text-black !ring-white',
      mutedOutline:
        'bg-transparent border border-text-muted text-text-muted !ring-text-muted',
      muted: 'bg-background-lightest !ring-background-lightest text-text-muted',
      transparent: 'bg-transparent border border-transparent',
      redOutline: 'bg-transparent border border-text-red !ring-text-red',
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
      md: 'px-5 py-2',
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
        <div className='flex items-center justify-center'>
          {loadingText && (
            <>
              <span className='mr-2 whitespace-nowrap'>{loadingText}</span>{' '}
            </>
          )}
          <Spinner className='h-3.5 w-3.5' />
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
        {...props}
        {...nextLinkProps}
        className={cx(className, props.className)}
        ref={ref as any}
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
