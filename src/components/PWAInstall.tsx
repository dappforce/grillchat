import { env } from '@/env.mjs'
import useIsInIframe from '@/hooks/useIsInIframe'
import '@khmyznikov/pwa-install'
import { createPortal } from 'react-dom'
import urlJoin from 'url-join'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['pwa-install']: any
    }
  }
}

export default function PWAInstall() {
  const isInIframe = useIsInIframe(true)
  if (isInIframe) return null

  return createPortal(
    <pwa-install
      id='pwa-install'
      manifest-url={urlJoin(
        env.NEXT_PUBLIC_BASE_PATH,
        `/manifest${env.NEXT_PUBLIC_BASE_PATH.substring(1)}.json`
      )}
      manual-chrome='true'
      manual-apple='true'
    ></pwa-install>,
    document.body
  )
}
