import localforage from 'localforage'

export const appStorage = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: 'grillapp',
  version: 1.0,
})
