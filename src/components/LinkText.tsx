import { cx } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import Link, { LinkProps } from 'next/link'
import { ComponentProps, forwardRef } from 'react'

const linkTextStyles = cva('font-medium', {
  variants: {
    variant: {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type LinkTextProps = Omit<ComponentProps<'a'>, 'href'> &
  VariantProps<typeof linkTextStyles> & {
    href: LinkProps['href']
    openInNewTab?: boolean
  }

const LinkText = forwardRef<any, LinkTextProps>(function LinkText(
  { href, variant, openInNewTab, ...props },
  ref
) {
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
      />
    </Link>
  )
})

export default LinkText
