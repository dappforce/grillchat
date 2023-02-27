import { create as _create, StateCreator } from 'zustand'

const allStores: ReturnType<typeof _create>[] = []
const resetters: (() => void)[] = []

export const create = (<T extends unknown>(f: StateCreator<T> | undefined) => {
  if (f === undefined) return create
  const store = _create(f)
  const initialState = store.getState()
  allStores.push(store)
  resetters.push(() => {
    store.setState(initialState, true)
  })
  return store
}) as typeof _create

export const resetAllStores = () => {
  for (const resetter of resetters) {
    resetter()
  }
}

export const initAllStores = () => {
  allStores.forEach((store) => {
    const state = store.getState() as { init?: () => void }
    if (typeof state.init === 'function') {
      state.init()
    }
  })
}
