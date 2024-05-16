import localforage from 'localforage'

export const appStorage = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: 'epicapp',
  version: 1.0,
})
