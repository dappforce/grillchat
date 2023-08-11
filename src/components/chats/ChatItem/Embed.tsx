import { cx } from '@/utils/class-names'
import { ComponentProps, useMemo } from 'react'
import {
  FacebookEmbed,
  InstagramEmbed,
  TikTokEmbed,
  TwitterEmbed,
  YouTubeEmbed,
} from 'react-social-media-embed'

export type EmbedProps = ComponentProps<'div'> & {
  url: string
}

const urlMapper: {
  component: React.ElementType<{ url: string }>
  checker: (url: string) => boolean
}[] = [
  {
    component: ({ url }) => (
      <YouTubeEmbed url={url} width='100%' height={300} />
    ),
    checker: (url: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/.test(
        url
      ),
  },
  {
    component: ({ url }) => <TwitterEmbed url={url} width='100%' />,
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
]

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
    <div
      {...props}
      className={cx('w-full overflow-hidden rounded-lg', props.className)}
    >
      {Test && <Test url={url} />}
    </div>
  )
}
