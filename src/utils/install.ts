export function isInstallAvailable() {
  if (typeof window === 'undefined') return false

  const pwaInstall = document.getElementById('pwa-install') as any
  if (!pwaInstall) return false

  return !pwaInstall.isRelatedAppsInstalled && !pwaInstall.isUnderStandaloneMode
}

export function installApp() {
  const pwaInstall = document.getElementById('pwa-install') as any
  if (!pwaInstall) return
  pwaInstall.showDialog?.(true)
}

export function listenInstalledApp(callback: () => void) {
  const pwaInstall = document.getElementById('pwa-install') as any
  pwaInstall.addEventListener('pwa-install-success-event', callback)

  return pwaInstall.removeEventListener('pwa-install-success-event', callback)
}
