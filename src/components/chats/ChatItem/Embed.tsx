import { cx } from '@/utils/class-names'
import { ComponentProps, useMemo } from 'react'
import {
  InstagramEmbed,
  TikTokEmbed,
  YouTubeEmbed,
} from 'react-social-media-embed'
import { Tweet } from 'react-tweet'
import styles from './Embed.module.css'

export type EmbedProps = ComponentProps<'div'> & {
  link: string
}

export default function Embed({ link: url, ...props }: EmbedProps) {
  const Component = useMemo(() => getComponent(url), [url])

  return (
    Component && (
      <div {...props} className={cx('w-full overflow-hidden', props.className)}>
        <Component link={url} />
      </div>
    )
  )
}

const urlMapper: {
  name: string
  component: React.ElementType<{ link: string }>
  checker: (link: string) => boolean
}[] = [
  {
    name: 'youtube',
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
    name: 'twitter',
    component: ({ link }) => {
      const urlWithoutQuery = link.split('?')[0]
      const tweetId = urlWithoutQuery.split('/').pop()
      if (!tweetId) return null

      return (
        <div className={cx('w-full [&>*]:!my-0', styles.Embed)}>
          <Tweet id={tweetId} />
        </div>
      )
    },
    checker: (link: string) =>
      (/(?:https?:\/\/)?(?:www\.)?(?:x\.com)\/(.+)/.test(link) ||
        /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com)\/(.+)/.test(link)) &&
      /\/status\/\d+/.test(link),
  },
  {
    name: 'tiktok',
    component: ({ link }) => <TikTokEmbed url={link} width={325} />,
    checker: (link: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com)\/(.+)/.test(link),
  },
  {
    name: 'instagram',
    component: ({ link }) => <InstagramEmbed url={link} width='100%' />,
    checker: (link: string) =>
      /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com)\/(.+)/.test(link),
  },
]

function getComponent(link: string) {
  const component = urlMapper.find((item) => item.checker(link))?.component
  if (component) {
    return component
  }
  return null
}

export function useCanRenderEmbed(link: string) {
  return useMemo(() => {
    const embedType = urlMapper.find((item) => item.checker(link))?.name
    return embedType && embedType !== 'preview'
  }, [link])
}
