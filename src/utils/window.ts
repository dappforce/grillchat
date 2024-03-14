import { env } from '@/env.mjs'
import { isMobile, isTablet } from 'react-device-detect'
import urlJoin from 'url-join'
import { getCurrentUrlOrigin } from './links'

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
export function getIsAnIframeInSameOrigin() {
  try {
    return (
      getIsInIframe() && getCurrentUrlOrigin() === window.parent.location.origin
    )
  } catch {
    return false
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

export function isInMobileOrTablet() {
  return isMobile || isTablet
}

const GLOBAL_QUERIES = ['ref']
export function replaceUrl(url: string) {
  let removedOrigin = url.replace(window.location.origin, '')
  // if url doesn't include basepath, it will add it
  if (
    !new RegExp(`^${env.NEXT_PUBLIC_BASE_PATH}/.`).test(removedOrigin) &&
    removedOrigin !== env.NEXT_PUBLIC_BASE_PATH
  ) {
    removedOrigin = urlJoin(env.NEXT_PUBLIC_BASE_PATH, removedOrigin)
  }

  const [pathname, query] = removedOrigin.split('?')
  const searchParams = new URLSearchParams(query)
  const currentSearchParams = new URLSearchParams(window.location.search)
  for (const key of GLOBAL_QUERIES) {
    if (currentSearchParams.has(key)) {
      searchParams.set(key, currentSearchParams.get(key)!)
    }
  }

  let finalUrl = pathname
  const finalQuery = searchParams.toString()
  if (finalQuery) {
    finalUrl += '?' + finalQuery
  }

  window.history.replaceState(
    { ...window.history.state, url: finalUrl, as: finalUrl },
    '',
    finalUrl
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
