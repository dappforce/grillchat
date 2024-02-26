import { cx } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import Link, { LinkProps } from 'next/link'
import { ComponentProps, forwardRef } from 'react'
import { HiArrowUpRight } from 'react-icons/hi2'

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
  Omit<ComponentProps<'a'>, 'href'> &
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
    <Link href={href} passHref legacyBehavior>
      <a
        {...props}
        {...anchorProps}
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
      </a>
    </Link>
  )
})

export default LinkText
