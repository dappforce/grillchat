import { cx } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import { LinkProps } from 'next/link'
import { forwardRef } from 'react'
import { HiArrowUpRight } from 'react-icons/hi2'
import CustomLink, { CustomLinkProps } from './referral/CustomLink'

export const linkTextStyles = cva(
  'cursor-pointer hover:underline focus-visible:underline',
  {
    variants: {
      variant: {
        primary: 'text-text-primary',
        secondary: 'text-text-secondary',
        'secondary-light': 'text-text-secondary-light',
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export type LinkTextProps = Omit<
  Omit<CustomLinkProps, 'href'> &
    VariantProps<typeof linkTextStyles> & {
      href?: LinkProps['href']
      openInNewTab?: boolean
      withArrow?: boolean
      arrowClassName?: string
    },
  'ref'
>

const LinkText = forwardRef<any, LinkTextProps>(function LinkText(
  { href, variant, openInNewTab, withArrow, arrowClassName, ...props },
  ref
) {
  if (!href) {
    return (
      <span
        {...props}
        ref={ref}
        className={cx(linkTextStyles({ variant }), props.className)}
      >
        {props.children}
        {withArrow && (
          <HiArrowUpRight
            className={cx(
              'relative -top-px ml-1 inline text-sm',
              arrowClassName
            )}
          />
        )}
      </span>
    )
  }

  let anchorProps = {}
  if (openInNewTab) {
    anchorProps = {
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }

  return (
    <CustomLink
      {...props}
      {...anchorProps}
      className={cx(linkTextStyles({ variant }), props.className)}
      href={href}
      ref={ref}
    >
      {props.children}
      {withArrow && (
        <HiArrowUpRight
          className={cx('relative -top-px ml-1 inline text-sm', arrowClassName)}
        />
      )}
    </CustomLink>
  )
})

export default LinkText
