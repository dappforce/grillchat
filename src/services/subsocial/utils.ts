const OPTIMISTIC_ID_PREFIX = 'optimistic-'

export function generateOptimisticId() {
  return `${OPTIMISTIC_ID_PREFIX}${Date.now()}`
}

export function isOptimisticId(id: string) {
  return id.startsWith(OPTIMISTIC_ID_PREFIX)
}
