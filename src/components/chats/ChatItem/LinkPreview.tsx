import LinkText from '@/components/LinkText'
import MediaLoader from '@/components/MediaLoader'
import { cx } from '@/utils/class-names'
import { LinkMetadata } from '@subsocial/api/types'
import truncate from 'lodash.truncate'
import { ComponentProps } from 'react'
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
          className={cx(
            'font-semibold',
            isMyMessage ? 'text-text-secondary-light' : 'text-text-primary'
          )}
        >
          {siteName}
        </LinkText>
        <p className='font-semibold'>{truncatedTitle}</p>
        <p
          className={cx(
            isMyMessage ? 'text-text-muted-on-primary' : 'text-text-muted'
          )}
        >
          {truncatedDesc}
        </p>
        <MediaLoader
          src={linkMetadata.image ?? ''}
          alt=''
          width={600}
          height={400}
          className='mt-2 rounded-lg'
        />
      </div>
    </div>
  )
}
