import LinkText from '@/components/LinkText'
import MediaLoader from '@/components/MediaLoader'
import { cx } from '@/utils/class-names'
import { LinkMetadata } from '@subsocial/api/types'
import truncate from 'lodash/truncate'
import { ComponentProps, useMemo } from 'react'
import {
  FacebookEmbed,
  InstagramEmbed,
  TikTokEmbed,
  YouTubeEmbed,
} from 'react-social-media-embed'
import { Tweet } from 'react-tweet'

export type EmbedProps = ComponentProps<'div'> & {
  link: string
  linkMetadata?: LinkMetadata
}

export default function Embed({
  link: url,
  linkMetadata,
  ...props
}: EmbedProps) {
  const Component = useMemo(() => getComponent(url), [url])

  return (
    <div {...props} className={cx('w-full', props.className)}>
      {Component && <Component link={url} linkMetadata={linkMetadata} />}
    </div>
  )
}

type EmbedComponentProps = {
  link: string
  linkMetadata?: LinkMetadata
}
const urlMapper: {
  component: React.ElementType<EmbedComponentProps>
  checker: (link: string) => boolean
}[] = [
  {
    component: ({ link }) => (
      <div className='w-full overflow-hidden rounded-lg'>
        <YouTubeEmbed url={link} width='100%' height={300} />
      </div>
    ),
    checker: (link: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/.test(
        link
      ),
  },
  {
    component: ({ link }) => {
      const urlWithoutQuery = link.split('?')[0]
      const tweetId = urlWithoutQuery.split('/').pop()
      if (!tweetId) return null

      return (
        <div className='w-full [&>*]:!my-0'>
          <Tweet id={tweetId} />
        </div>
      )
    },
    checker: (link: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com)\/(.+)/.test(link),
  },
  {
    component: ({ link }) => <TikTokEmbed url={link} width={325} />,
    checker: (link: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com)\/(.+)/.test(link),
  },
  {
    component: ({ link }) => <InstagramEmbed url={link} width='100%' />,
    checker: (link: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com)\/(.+)/.test(link),
  },
  {
    component: ({ link }) => <FacebookEmbed url={link} width='100%' />,
    checker: (link: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com)\/(.+)/.test(link),
  },

  // fallback, default link preview
  {
    checker: () => true,
    component: DefaultLinkPreview,
  },
]

function DefaultLinkPreview({ link, linkMetadata }: EmbedComponentProps) {
  if (!linkMetadata) return null

  const siteName = truncate(
    linkMetadata.siteName || linkMetadata.hostName || linkMetadata.title,
    {
      length: 30,
    }
  )

  return (
    <div className='w-full rounded-2xl bg-background-light p-3'>
      <div className='border-l-2 border-background-primary pl-2.5'>
        <LinkText href={link} variant='primary'>
          {siteName}
        </LinkText>
        <p className='font-semibold'>{linkMetadata.title}</p>
        <p className='text-text-muted'>{linkMetadata.description}</p>
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

function getComponent(url: string) {
  const component = urlMapper.find((item) => item.checker(url))?.component
  if (component) {
    return component
  }
  return null
}
