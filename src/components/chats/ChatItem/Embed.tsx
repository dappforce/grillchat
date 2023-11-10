import { cx } from '@/utils/class-names'
import { ComponentProps, useMemo } from 'react'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import { InstagramEmbed, TikTokEmbed } from 'react-social-media-embed'
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

function getYoutubeVideoId(youtubeLink: string) {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = youtubeLink.match(regExp)
  if (match && match[2].length == 11) {
    return match[2]
  } else {
    return undefined
  }
}

function YoutubeEmbed({ link }: { link: string }) {
  const youtubeId = useMemo(() => getYoutubeVideoId(link), [link])

  if (!youtubeId) return null

  return (
    <div className='w-full overflow-hidden rounded-lg'>
      <LiteYouTubeEmbed
        id={youtubeId}
        adNetwork={true}
        params=''
        playlist={false}
        poster='hqdefault'
        title='YouTube Embed'
        noCookie={true}
        wrapperClass={cx('w-full h-[300px] rounded-md bg-center relative')}
        activatedClass='group activated'
        playerClass={cx(
          'bg-[#f00] rounded-2xl w-20 h-14 top-1/2 left-1/2 -translate-x-1/2 absolute -translate-y-1/2',
          'before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:border-t-[11px] before:border-r-[0px] before:border-b-[11px] before:border-l-[19px] before:border-[transparent_transparent_transparent_white]',
          'group-[.activated]:hidden'
        )}
        iframeClass='w-full h-full'
        aspectHeight={9}
        aspectWidth={16}
      />
    </div>
  )
}

const urlMapper: {
  name: string
  component: React.ElementType<{ link: string }>
  checker: (link: string) => boolean
}[] = [
  {
    name: 'youtube',
    component: ({ link }) => <YoutubeEmbed link={link} />,
    checker: (link: string) =>
      /^http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/.test(
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
