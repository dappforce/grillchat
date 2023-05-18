import useIsInIframe from '@/hooks/useIsInIframe'
import { useLocation } from '@/stores/location'
import { getCurrentUrlOrigin } from '@/utils/links'
import { useRouter } from 'next/router'
import Button, { ButtonProps } from './Button'

export type BackButtonProps = ButtonProps & {
  defaultBackLink?: string
  forceUseDefaultBackLink?: boolean
  noStyle?: boolean
}

export default function BackButton({
  defaultBackLink = '/',
  forceUseDefaultBackLink,
  noStyle,
  ...props
}: BackButtonProps) {
  const isInIframe = useIsInIframe()
  const prevUrl = useLocation((state) => state.prevUrl)
  const router = useRouter()

  const hasBackToCurrentSession = !!prevUrl

  const prevUrlPathname = prevUrl?.replace(getCurrentUrlOrigin(), '')
  const isDefaultBackLinkSameAsPrevUrl = defaultBackLink === prevUrlPathname

  const buttonProps: ButtonProps =
    hasBackToCurrentSession &&
    (!forceUseDefaultBackLink || isDefaultBackLinkSameAsPrevUrl)
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
