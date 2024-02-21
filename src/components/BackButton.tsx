import { env } from '@/env.mjs'
import useIsInIframe from '@/hooks/useIsInIframe'
import { useLocation } from '@/stores/location'
import { getCurrentUrlOrigin } from '@/utils/links'
import { useRouter } from 'next/router'
import urlJoin from 'url-join'
import Button, { ButtonProps } from './Button'

export type BackButtonProps = ButtonProps & {
  defaultBackLink?: string
  forceUseDefaultBackLink?: boolean
  noStyle?: boolean
}

const homeLinks = ['/', '/my-chats', '/hubs', '/hot-chats']

export default function BackButton({
  defaultBackLink = '/',
  forceUseDefaultBackLink = true,
  noStyle,
  ...props
}: BackButtonProps) {
  const isInIframe = useIsInIframe()
  const prevUrl = useLocation((state) => state.prevUrl)
  const router = useRouter()

  const hasBackToCurrentSession = !!prevUrl

  const prevUrlPathname = prevUrl?.replace(
    urlJoin(getCurrentUrlOrigin(), env.NEXT_PUBLIC_BASE_PATH),
    ''
  )
  let isDefaultBackLinkSameAsPrevUrl = defaultBackLink === prevUrlPathname
  if (homeLinks.includes(defaultBackLink)) {
    isDefaultBackLinkSameAsPrevUrl = homeLinks.includes(prevUrlPathname ?? '')
  }

  const shouldUseRouterBack =
    hasBackToCurrentSession &&
    !isInIframe &&
    (!forceUseDefaultBackLink || isDefaultBackLinkSameAsPrevUrl)

  const buttonProps: ButtonProps = shouldUseRouterBack
    ? { onClick: () => router.back() }
    : { href: defaultBackLink, nextLinkProps: { replace: isInIframe } }

  return (
    <Button
      {...buttonProps}
      {...props}
      size={noStyle ? 'noPadding' : props.size}
      variant={noStyle ? 'transparent' : props.variant}
      interactive={noStyle ? 'none' : props.interactive}
    />
  )
}
