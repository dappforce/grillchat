import localforage from 'localforage'

export const appStorage = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: 'grill.chat',
  version: 1.0,
})
