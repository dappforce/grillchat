import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import urlJoin from 'url-join'
import { useReferralId } from './ReferralUrlChanger'

export type CustomLinkProps = React.ComponentProps<typeof Link> & {
  forceHardNavigation?: boolean
}
export default function ProfileLinkCustomLink({
  forceHardNavigation,
  ...props
}: Omit<React.ComponentProps<typeof Link>, 'href'> & {
  forceHardNavigation?: boolean
  href?: LinkProps['href']
}) {
  const refId = useReferralId()
  const { href, as } = props
  const { pathname } = useRouter()

  if (!href) {
    return <span {...props} />
  }

  if (refId) {
    props = {
      ...props,
      href: augmentLink(href, refId),
      as: as && augmentLink(as, refId),
    }
  }

  if (forceHardNavigation && typeof props.href === 'string') {
    return <a {...props} href={props.href} />
  }

  return (
    <Link
      {...props}
      onClick={(e) => {
        if (pathname === href) {
          e.stopPropagation()
          e.preventDefault()
        }
        props.onClick?.(e)
      }}
      href={href}
    />
  )
}

function augmentLink(link: LinkProps['href'], refId: string) {
  if (typeof link === 'string') {
    if (link.startsWith('http')) return link
    // urljoin have issue with '/', '?ref=...', where it becomes '/ref=...'
    if (link === '/') return `/?ref=${refId}`
    return urlJoin(link, `?ref=${refId}`)
  } else {
    return {
      ...link,
      query:
        typeof link.query === 'string'
          ? urlJoin(link.query, `?ref=${refId}`)
          : {
              ...link.query,
              ref: refId,
            },
    }
  }
}
