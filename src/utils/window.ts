export function preventWindowUnload() {
  window.onbeforeunload = function (e) {
    e.preventDefault()
    // For IE and Firefox prior to version 4
    if (e) {
      e.returnValue = ''
    }

    // For Safari
    return ''
  }
}

export function allowWindowUnload() {
  window.onbeforeunload = null
}

export function waitStopScrolling(scrollContainer?: HTMLElement | null) {
  return new Promise<void>((resolve) => {
    let lastScrollTop = 0
    const interval = setInterval(() => {
      const scrollTop =
        scrollContainer?.scrollTop ||
        window.scrollY ||
        document.documentElement.scrollTop
      if (scrollTop === lastScrollTop) {
        clearInterval(interval)
        resolve()
      }
      lastScrollTop = scrollTop
    }, 100)
  })
}

export function getIsInIframe() {
  try {
    return window.self !== window.parent
  } catch (e) {
    return true
  }
}
export function getIsInIos() {
  if (typeof window === 'undefined') return false
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

export function replaceUrl(url: string) {
  const pathname = url.replace(window.location.origin, '')
  window.history.replaceState(
    { ...window.history.state, url: pathname, as: pathname },
    '',
    url
  )
}

export function getWorkbox() {
  if (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    (window as any).workbox !== undefined
  ) {
    return (window as any).workbox
  }
  return null
}

export function isPWA() {
  // @ts-ignore
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-ignore
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  )
}

export function isWebNotificationsEnabled() {
  if (typeof Notification === 'undefined') return false
  return Notification?.permission === 'granted'
}

export function sendMessageToParentWindow(name: string, value: string) {
  window.parent?.postMessage(`grill:${name}:${value}`, '*')
}
