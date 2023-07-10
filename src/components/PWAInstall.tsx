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
  return createPortal(
    <pwa-install id='pwa-install' manifest-url='/manifest.json'></pwa-install>,
    document.body
  )
}
