import { ACCOUNT_SECRET_KEY_URL_PARAMS } from '@/pages/account'
import { useMyAccount } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { getCurrentUrlOrigin } from '@/utils/links'
import { useRouter } from 'next/router'
import urlJoin from 'url-join'
import Button, { ButtonProps } from './Button'

type DeepLinkProps = {
  customDeeplinkReturnUrl?: (currentUrl: string) => string
}
export type MetamaskDeepLinkProps = ButtonProps & DeepLinkProps

export function isInsideMetamaskBrowser() {
  return (
    typeof window === 'undefined' ||
    !isTouchDevice() ||
    (window as any).ethereum
  )
}

export function useMetamaskDeepLink({
  customDeeplinkReturnUrl,
}: DeepLinkProps) {
  const router = useRouter()
  const encodedSecretKey = useMyAccount((state) => state.encodedSecretKey)

  const shareSessionUrl = urlJoin(
    getCurrentUrlOrigin(),
    `/account?${ACCOUNT_SECRET_KEY_URL_PARAMS}=${encodedSecretKey}&returnUrl=${encodeURIComponent(
      customDeeplinkReturnUrl?.(router.asPath) ?? router.asPath
    )}`
  )

  return `https://metamask.app.link/dapp/${shareSessionUrl.replace(
    /^https:\/\/w?w?w?\.?/,
    ''
  )}`
}

export default function MetamaskDeepLink({
  customDeeplinkReturnUrl,
  ...props
}: MetamaskDeepLinkProps) {
  const deepLink = useMetamaskDeepLink({ customDeeplinkReturnUrl })

  return <Button {...props} href={deepLink} />
}
