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

export function getUrlQuery(queryName: string) {
  const query = window.location.search
  const searchParams = new URLSearchParams(query)
  return searchParams.getAll(queryName)
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
    return window.self !== window.top
  } catch (e) {
    return true
  }
}
