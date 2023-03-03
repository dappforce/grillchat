import { cx } from '@/utils/className'
import { cva, VariantProps } from 'class-variance-authority'
import Link, { LinkProps } from 'next/link'
import { ComponentProps } from 'react'

const linkTextStyles = cva('', {
  variants: {
    variant: {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      default: 'font-medium',
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

export default function LinkText({ href, variant, ...props }: LinkTextProps) {
  let anchorProps = {}
  if (props.openInNewTab) {
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
        className={cx(
          props.className,
          linkTextStyles({ variant }),
          'font-medium'
        )}
      />
    </Link>
  )
}
