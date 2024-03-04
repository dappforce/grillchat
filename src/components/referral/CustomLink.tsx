import Link, { LinkProps } from 'next/link'
import urlJoin from 'url-join'
import { useReferralId } from './ReferralUrlChanger'

export default function CustomLink(props: React.PropsWithChildren<LinkProps>) {
  const refId = useReferralId()
  if (refId) {
    const { href, as } = props
    props = {
      ...props,
      href: augmentLink(href, refId),
      as: as && augmentLink(as, refId),
    }
  }

  return <Link {...props} />
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
