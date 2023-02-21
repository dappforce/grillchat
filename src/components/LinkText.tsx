import { cx } from '@/utils/className'
import Link, { LinkProps } from 'next/link'
import { ComponentProps } from 'react'

export type LinkTextProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: LinkProps['href']
}

export default function LinkText({ href, ...props }: LinkTextProps) {
  return (
    <Link href={href} passHref legacyBehavior>
      <a {...props} className={cx(props.className, 'font-medium')} />
    </Link>
  )
}
