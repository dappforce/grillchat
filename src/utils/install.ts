export function isInstallAvailable() {
  if (typeof window === 'undefined') return false

  const pwaInstall = document.getElementById('pwa-install') as any
  if (!pwaInstall) return false

  return !!pwaInstall.isInstallAvailable
}

export function installApp() {
  const pwaInstall = document.getElementById('pwa-install') as any
  if (!pwaInstall) return
  pwaInstall.showDialog?.()
}
