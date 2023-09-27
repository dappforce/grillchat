import { appStorage } from '@/constants/localforage'

type Storage<Params extends unknown[]> = {
  get: (...params: Params) => string | undefined | null
  set: (value: string, ...params: Params) => void
  remove: () => void
}
type AsyncStorage<Params extends unknown[], Data = string> = {
  get: (
    ...params: Params
  ) => Promise<Data | undefined | null> | Data | undefined | null
  set: (value: Data, ...params: Params) => Promise<void> | void
  remove: () => Promise<void> | void
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

export class SessionStorage<Params extends unknown[]>
  implements Storage<Params>
{
  constructor(private readonly nameGetter: (...params: Params) => string) {}

  get(...params: Params) {
    try {
      if (typeof window === 'undefined') return null
      return sessionStorage.getItem(this.nameGetter(...params))
    } catch {
      return null
    }
  }
  set(value: string, ...params: Params) {
    try {
      if (typeof window === 'undefined') return
      sessionStorage.setItem(this.nameGetter(...params), value)
    } catch {}
  }
  remove(...params: Params) {
    try {
      if (typeof window === 'undefined') return
      sessionStorage.removeItem(this.nameGetter(...params))
    } catch {}
  }
}

export class LocalForage<Params extends unknown[], Data = string>
  implements AsyncStorage<Params, Data>
{
  constructor(private readonly nameGetter: (...params: Params) => string) {}

  get(...params: Params) {
    try {
      if (typeof window === 'undefined') return null
      return appStorage.getItem<Data>(this.nameGetter(...params))
    } catch {
      return null
    }
  }
  set(value: Data, ...params: Params) {
    try {
      if (typeof window === 'undefined') return
      appStorage.setItem(this.nameGetter(...params), value)
    } catch {}
  }
  remove(...params: Params) {
    try {
      if (typeof window === 'undefined') return
      appStorage.removeItem(this.nameGetter(...params))
    } catch {}
  }
}

export class LocalStorageAndForage<Params extends unknown[]>
  implements Storage<Params>
{
  private localStorage: LocalStorage<Params>
  private localForage: LocalForage<Params>

  constructor(nameGetter: (...params: Params) => string) {
    this.localStorage = new LocalStorage(nameGetter)
    this.localForage = new LocalForage(nameGetter)
  }

  get(...params: Params) {
    return this.localStorage.get(...params)
  }

  set(value: string, ...params: Params) {
    this.localStorage.set(value, ...params)
    this.localForage.set(value, ...params)
  }

  remove(...params: Params) {
    this.localStorage.remove(...params)
    this.localForage.remove(...params)
  }
}

export class SafeLocalStorage {
  static getItem(key: string) {
    try {
      if (typeof window === 'undefined') return null
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }
  static setItem(key: string, value: string) {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(key, value)
    } catch {}
  }
  static removeItem(key: string) {
    try {
      if (typeof window === 'undefined') return
      localStorage.removeItem(key)
    } catch {}
  }
}
