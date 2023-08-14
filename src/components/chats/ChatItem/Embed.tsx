import LinkText from '@/components/LinkText'
import MediaLoader from '@/components/MediaLoader'
import { getMetadataQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
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
  url: string
}

const urlMapper: {
  component: React.ElementType<{ url: string }>
  checker: (url: string) => boolean
}[] = [
  {
    component: ({ url }) => (
      <div className='w-full overflow-hidden rounded-lg'>
        <YouTubeEmbed url={url} width='100%' height={300} />
      </div>
    ),
    checker: (url: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/.test(
        url
      ),
  },
  {
    component: ({ url }) => {
      const urlWithoutQuery = url.split('?')[0]
      const tweetId = urlWithoutQuery.split('/').pop()
      if (!tweetId) return null

      return (
        <div className='w-full [&>*]:!my-0'>
          <Tweet id={tweetId} />
        </div>
      )
    },
    checker: (url: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com)\/(.+)/.test(url),
  },
  {
    component: ({ url }) => <TikTokEmbed url={url} width={325} />,
    checker: (url: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com)\/(.+)/.test(url),
  },
  {
    component: ({ url }) => <InstagramEmbed url={url} width='100%' />,
    checker: (url: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com)\/(.+)/.test(url),
  },
  {
    component: ({ url }) => <FacebookEmbed url={url} width='100%' />,
    checker: (url: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com)\/(.+)/.test(url),
  },

  // fallback, default link preview
  {
    checker: () => true,
    component: DefaultLinkPreview,
  },
]

function DefaultLinkPreview({ url }: { url: string }) {
  const { data } = getMetadataQuery.useQuery(url, {
    retry: false,
  })
  if (!data) return null
  const siteName = truncate(data.siteName || data.hostName || data.title, {
    length: 30,
  })

  return (
    <div className='w-full rounded-2xl bg-background-light p-3'>
      <div className='border-l-2 border-background-primary pl-2.5'>
        <LinkText href={url} variant='primary'>
          {siteName}
        </LinkText>
        <p className='font-semibold'>{data.title}</p>
        <p className='text-text-muted'>{data.description}</p>
        <MediaLoader
          src={data.image ?? ''}
          alt=''
          width={600}
          height={400}
          className='mt-2 rounded-lg'
        />
      </div>
    </div>
  )
}

const getComponent = (url: string) => {
  const component = urlMapper.find((item) => item.checker(url))?.component
  if (component) {
    return component
  }
  return null
}

export default function Embed({ url, ...props }: EmbedProps) {
  const Test = useMemo(() => getComponent(url), [url])

  return (
    <div {...props} className={cx('w-full', props.className)}>
      {Test && <Test url={url} />}
    </div>
  )
}
