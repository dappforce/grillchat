type Storage<Params extends unknown[]> = {
  get: (...params: Params) => string | undefined | null
  set: (value: string, ...params: Params) => void
  remove: () => void
}

export class LocalStorage<Params extends unknown[]> implements Storage<Params> {
  constructor(private readonly nameGetter: (...params: Params) => string) {}

  get(...params: Params) {
    try {
      if (typeof window === 'undefined') return null
      return localStorage.getItem(this.nameGetter(...params))
    } catch {
      return null
    }
  }
  set(value: string, ...params: Params) {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(this.nameGetter(...params), value)
    } catch {}
  }
  remove(...params: Params) {
    try {
      if (typeof window === 'undefined') return
      localStorage.removeItem(this.nameGetter(...params))
    } catch {}
  }
}
