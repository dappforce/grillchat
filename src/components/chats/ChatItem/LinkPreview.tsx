import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import MediaLoader from '@/components/MediaLoader'
import { cx } from '@/utils/class-names'
import { currentNetwork } from '@/utils/network'
import { LinkMetadata } from '@subsocial/api/types'
import truncate from 'lodash.truncate'
import { ComponentProps, useMemo, useState } from 'react'
import { useCanRenderEmbed } from './Embed'

export type LinkPreviewProps = ComponentProps<'div'> & {
  link: string
  linkMetadata?: LinkMetadata
  renderNullIfLinkEmbedable?: boolean
  isMyMessage?: boolean
}
export default function LinkPreview({
  link,
  linkMetadata,
  renderNullIfLinkEmbedable,
  isMyMessage,
  ...props
}: LinkPreviewProps) {
  const canEmbed = useCanRenderEmbed(link)
  const { forceHardNavigation, text } = useMemo(
    () => getInternalLinkText(link),
    [link]
  )
  const [isImageError, setIsImageError] = useState(false)

  if (!linkMetadata || (canEmbed && renderNullIfLinkEmbedable)) return null

  const siteName = truncate(
    linkMetadata.siteName || linkMetadata.hostName || linkMetadata.title,
    {
      length: 30,
    }
  )

  const truncatedTitle = truncate(linkMetadata.title, {
    length: 100,
  })
  const truncatedDesc = truncate(linkMetadata.description, {
    length: 300,
  })

  const isValidImage = linkMetadata.image?.startsWith('https://')

  return (
    <div {...props} className={cx('w-full', props.className)}>
      <div
        className={cx(
          'border-l-2 pl-2.5',
          isMyMessage ? 'border-text-secondary-light' : 'border-text-primary'
        )}
      >
        <LinkText
          href={link}
          variant='primary'
          openInNewTab
          className={cx(
            'font-semibold',
            isMyMessage ? 'text-text-secondary-light' : 'text-text-primary'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {siteName}
        </LinkText>
        <p className='font-semibold'>{truncatedTitle}</p>
        <p
          className={cx(
            isMyMessage ? 'text-text-muted-on-primary-light' : 'text-text-muted'
          )}
        >
          {truncatedDesc}
        </p>
        {!isImageError && linkMetadata.image && isValidImage && (
          <MediaLoader
            src={linkMetadata.image ?? ''}
            alt=''
            width={600}
            height={400}
            onError={() => setIsImageError(true)}
            className='mt-2 max-h-72 rounded-lg bg-background-lighter/50 object-contain'
          />
        )}
        {text && (
          <Button
            onClick={(e) => e.stopPropagation()}
            variant={isMyMessage ? 'whiteOutline' : 'primaryOutline'}
            className='mt-2 w-full'
            href={link}
            nextLinkProps={{ forceHardNavigation }}
          >
            {text}
          </Button>
        )}
      </div>
    </div>
  )
}

type InternalLink = {
  checker: (link: string) => boolean
  text: string
  forceHardNavigation?: boolean
}
const grillChatInternalLinkTexts: InternalLink[] = [
  {
    checker: (link: string) =>
      // regex for url grill.chat/[any text]/[any text] for message page
      /(?:https?:\/\/)?(?:www\.)?(?:grill\.chat)\/(.+)\/(.+)\/(.+)/.test(link),
    text: 'View message',
  },
  {
    checker: (link: string) =>
      // regex for url grill.chat/[any text]/[any text] for chat page
      /(?:https?:\/\/)?(?:www\.)?(?:grill\.chat)\/(.+)\/(.+)/.test(link),
    text: 'Open chat',
  },
  {
    checker: (link: string) =>
      // regex for url grill.chat/[any text] for hub page
      /(?:https?:\/\/)?(?:www\.)?(?:grill\.chat)\/(.+)/.test(link),
    text: 'Open page',
  },
]

const grillAppInternalLinkTexts: InternalLink[] = [
  {
    checker: (link: string) =>
      // regex for url grillapp.net/c/[any text]/[any text] for message page
      /(?:https?:\/\/)?(?:www\.)?(?:grillapp\.net)\/c\/(.+)\/(.+)\/(.+)/.test(
        link
      ),
    text: 'View message',
  },
  {
    checker: (link: string) =>
      // regex for url grillapp.net/c[any text]/[any text] for chat page
      /(?:https?:\/\/)?(?:www\.)?(?:grillapp\.net)\/c\/(.+)\/(.+)/.test(link),
    text: 'Open chat',
  },
  {
    checker: (link: string) =>
      // regex for url grillapp.net/c[any text] for hub page
      /(?:https?:\/\/)?(?:www\.)?(?:grillapp\.net)\/c\/(.+)/.test(link),
    text: 'Open page',
  },
  {
    checker: (link: string) =>
      // regex for url grillapp.net/[any text] for polkaverse pages
      /(?:https?:\/\/)?(?:www\.)?(?:grillapp\.net)\/(.+)/.test(link),
    text: 'Open page',
    forceHardNavigation: true,
  },
]
function getInternalLinkText(link: string) {
  const usedInternalLinkChecker =
    currentNetwork === 'xsocial'
      ? grillChatInternalLinkTexts
      : grillAppInternalLinkTexts
  const found = usedInternalLinkChecker.find((item) => item.checker(link))
  return { text: found?.text, forceHardNavigation: found?.forceHardNavigation }
}
