export function isEmptyObject(obj: Record<string, unknown>) {
  return Object.keys(obj).length === 0
}

export function debounce(fn: Function, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

export function removeUndefinedValues<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T
}
