import { ACCOUNT_SECRET_KEY_URL_PARAMS } from '@/pages/account'
import { useMyAccount } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { getCurrentUrlOrigin } from '@/utils/links'
import urlJoin from 'url-join'
import Button, { ButtonProps } from './Button'

export type MetamaskDeeplinkProps = ButtonProps

export function isInsideMetamaskBrowser() {
  return (
    typeof window === 'undefined' ||
    !isTouchDevice() ||
    (window as any).ethereum
  )
}

export default function MetamaskDeepLink({ ...props }: MetamaskDeeplinkProps) {
  const encodedSecretKey = useMyAccount((state) => state.encodedSecretKey)

  const shareSessionUrl = urlJoin(
    getCurrentUrlOrigin(),
    `/account?${ACCOUNT_SECRET_KEY_URL_PARAMS}=${encodedSecretKey}`
  )

  return (
    <Button
      {...props}
      href={`https://metamask.app.link/dapp/${shareSessionUrl.replace(
        /^https:\/\/w?w?w?\.?/,
        ''
      )}`}
    />
  )
}
