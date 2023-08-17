import { useAnalytics } from '@/stores/analytics'

export function isInstallAvailable() {
  if (typeof window === 'undefined') return false

  const pwaInstall = document.getElementById('pwa-install') as any
  if (!pwaInstall) return false

  return !!pwaInstall.isInstallAvailable
}

export function installApp() {
  const { sendEvent } = useAnalytics.getState()

  sendEvent('start_install_pwa')
  const pwaInstall = document.getElementById('pwa-install') as any
  if (!pwaInstall) return
  pwaInstall.showDialog?.()

  window.addEventListener('appinstalled', () => {
    sendEvent('pwa_installed', {}, { pwaInstalled: true })
  })
}
