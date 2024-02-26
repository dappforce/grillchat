import { cx } from '@/utils/class-names'
import { ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
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

const YOUTUBE_REGEX =
  /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/
export function getYoutubeVideoId(youtubeLink: string) {
  const match = youtubeLink.match(YOUTUBE_REGEX)
  const id = decodeURIComponent(match?.[2] ?? '')
  if (id.length === 11) {
    return id
  } else {
    return undefined
  }
}

export function YoutubeEmbed({
  link,
  ...props
}: { link: string } & ComponentProps<'div'>) {
  const [thumbnailRes, setThumbnailRes] =
    useState<ThumbnailRes>('maxresdefault')
  const youtubeId = useMemo(() => getYoutubeVideoId(link), [link])

  if (!youtubeId) return null

  return (
    <div
      {...props}
      className={cx(
        'relative aspect-video w-full overflow-hidden rounded-lg',
        props.className
      )}
    >
      <YoutubeThumbnailChecker src={link} setThumbnailRes={setThumbnailRes} />
      <LiteYouTubeEmbed
        id={youtubeId}
        adNetwork={true}
        params=''
        playlist={false}
        poster={thumbnailRes}
        title='YouTube Embed'
        noCookie={true}
        wrapperClass={cx('inset-0 absolute w-full h-full bg-center bg-cover')}
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

const thumbnail = [
  'maxresdefault',
  'sddefault',
  'hqdefault',
  'mqdefault',
  'default',
] as const
export type ThumbnailRes = (typeof thumbnail)[number]

export function YoutubeThumbnailChecker({
  setThumbnailRes,
  src,
}: {
  src: string
  setThumbnailRes: (res: ThumbnailRes) => void
}) {
  const currentRetries = useRef(0)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const youtubeId = useMemo(() => getYoutubeVideoId(src), [src])
  const [res, setRes] = useState(0)
  useEffect(() => {
    setThumbnailRes(thumbnail[res])
  }, [res, setThumbnailRes])

  useEffect(() => {
    function checkImage() {
      if (imgRef.current?.complete) {
        if (
          imgRef.current.naturalWidth === 120 &&
          imgRef.current.naturalHeight === 90
        ) {
          if (res < thumbnail.length - 1) {
            setRes(res + 1)
          }
        }
      } else {
        currentRetries.current++
        if (currentRetries.current <= 5)
          setTimeout(() => {
            checkImage()
          }, 200)
      }
    }
    checkImage()
  }, [res])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=''
      ref={imgRef}
      style={{ display: 'none' }}
      src={`https://i3.ytimg.com/vi/${youtubeId}/${thumbnail[res]}.jpg`}
    />
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
