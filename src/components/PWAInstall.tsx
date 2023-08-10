import useIsInIframe from '@/hooks/useIsInIframe'
import '@khmyznikov/pwa-install'
import { createPortal } from 'react-dom'

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
      manifest-url='/manifest.json'
      manual-chrome='true'
      manual-apple='true'
    ></pwa-install>,
    document.body
  )
}
