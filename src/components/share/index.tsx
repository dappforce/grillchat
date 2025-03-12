import { PostData } from '@subsocial/api/types'

import { cx } from '@/utils/class-names'
import {
  facebookShareUrl,
  linkedInShareUrl,
  openNewWindow,
  redditShareUrl,
  twitterShareUrl,
} from '@/utils/social-share'
import { copyToClipboard } from '@/utils/strings'
import { BareProps } from '@/utils/types'
import { isDef } from '@subsocial/utils'
import clsx from 'clsx'
import {
  AiOutlineFacebook,
  AiOutlineLink,
  AiOutlineLinkedin,
  AiOutlineReddit,
  AiOutlineTwitter,
} from 'react-icons/ai'
import { LuShare2 } from 'react-icons/lu'
import { IconWithLabel } from '../IconWithLabel'
import FloatingMenus from '../floating/FloatingMenus'

type ShareMenuProps = {
  postDetails: PostData
  spaceId: string
  title?: string
  className?: string
  onClick?: () => void
  iconSize?: 'semilarge' | 'normal'
}

export type SomeShareLink = {
  url: string
  title?: string
  summary?: string
}

const FacebookIcon = <AiOutlineFacebook />
const TwitterIcon = <AiOutlineTwitter />
const LinkedInIcon = <AiOutlineLinkedin />
const RedditIcon = <AiOutlineReddit />
const LinkIcon = <AiOutlineLink />

type ShareLinkProps = {
  url: string
  children: React.ReactNode
}

type BlackLinkProps = BareProps &
  Partial<ShareLinkProps> & {
    onClick?: () => void
  }

export const BlackLink = ({
  children,
  className,
  style,
  onClick,
}: BlackLinkProps) => (
  <a
    className={className}
    onClick={(e) => {
      e.stopPropagation()
      e.preventDefault()

      onClick?.()
    }}
    style={style}
  >
    {children}
  </a>
)

export const ShareLink = ({ url, children }: ShareLinkProps) => (
  <BlackLink onClick={() => openNewWindow(url)}>{children}</BlackLink>
)

const FacebookShareLink = ({ url }: SomeShareLink) => (
  <ShareLink url={facebookShareUrl(url)}>
    <IconWithLabel icon={FacebookIcon} label='Facebook' />
  </ShareLink>
)

const TwitterShareLink = ({ url, title }: SomeShareLink) => (
  <ShareLink url={twitterShareUrl(url, title)}>
    <IconWithLabel icon={TwitterIcon} label='Twitter' />
  </ShareLink>
)

const LinkedInShareLink = ({ url, title, summary }: SomeShareLink) => (
  <ShareLink url={linkedInShareUrl(url, title, summary)}>
    <IconWithLabel icon={LinkedInIcon} label='LinkedIn' />
  </ShareLink>
)

const RedditShareLink = ({ url, title }: SomeShareLink) => (
  <ShareLink url={redditShareUrl(url, title)}>
    <IconWithLabel icon={RedditIcon} label='Reddit' />
  </ShareLink>
)

const CopyLink = ({ url }: SomeShareLink) => (
  <div
    onClick={(e) => {
      e.stopPropagation()
      e.preventDefault()

      copyToClipboard(url)
    }}
  >
    <IconWithLabel icon={LinkIcon} label='Copy link' />
  </div>
)

export const ShareDropdown = (props: ShareMenuProps) => {
  const {
    title = 'Share',
    spaceId,
    postDetails,
    className,
    iconSize = 'semilarge',
  } = props

  const currentPostUrl = `space/${spaceId}/${postDetails.id}`
  const postTitle = postDetails.content?.title
  const summary = postDetails.content?.body
  const sharesCount = postDetails.struct.sharesCount

  const getMenuItems = () => {
    return [
      {
        text: <FacebookShareLink url={currentPostUrl} />,
      },
      {
        text: <TwitterShareLink url={currentPostUrl} title={title} />,
      },
      {
        text: (
          <LinkedInShareLink
            url={currentPostUrl}
            title={title}
            summary={summary}
          />
        ),
      },
      {
        text: (
          <RedditShareLink
            url={currentPostUrl}
            title={postTitle}
            summary={summary}
          />
        ),
      },
      {
        text: <CopyLink url={currentPostUrl} />,
      },
    ]
  }

  return (
    <FloatingMenus
      menus={getMenuItems().filter(isDef)}
      allowedPlacements={['bottom-start']}
      mainAxisOffset={4}
      panelSize='xs'
    >
      {(config) => {
        const { referenceProps, toggleDisplay } = config || {}
        return (
          <div
            {...referenceProps}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              toggleDisplay?.()
            }}
            className={cx(
              'flex cursor-pointer items-center gap-1 text-text-primary',
              className
            )}
          >
            <IconWithLabel
              renderZeroCount
              icon={
                <LuShare2
                  className={clsx(
                    iconSize === 'semilarge' ? 'FontSemilarge' : 'FontNormal'
                  )}
                  style={{ position: 'relative', top: '0.04em' }}
                />
              }
              count={sharesCount || 0}
            />
          </div>
        )
      }}
    </FloatingMenus>
  )
}
