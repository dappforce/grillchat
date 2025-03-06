export function debounceFunction<T extends any[]>(
  func: (...args: T) => void,
  wait: number,
  immediate?: boolean
) {
  let timeout: number | undefined

  const executedFunction = (...args: T) => {
    if (typeof window === 'undefined') return

    const later = function () {
      timeout = undefined
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout
    window.clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)

    if (callNow) func(...args)
  }
  return executedFunction
}
