import useIsInIframe from '@/hooks/useIsInIframe'
import { useLocation } from '@/stores/location'
import { useRouter } from 'next/router'
import Button, { ButtonProps } from './Button'

export type BackButtonProps = ButtonProps & {
  defaultBackLink?: string
  noStyle?: boolean
}

export default function BackButton({
  defaultBackLink,
  noStyle,
  ...props
}: BackButtonProps) {
  const isInIframe = useIsInIframe()
  const prevUrl = useLocation((state) => state.prevUrl)
  const router = useRouter()

  const hasBackToCurrentSession = !!prevUrl
  const buttonProps: ButtonProps = hasBackToCurrentSession
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
