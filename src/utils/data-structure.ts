/**
 * A queue that only keeps the last N elements.
 * If the queue is full, the least used element is removed.
 */
type Data<T> = { data: T | null; insertedAt: Date }
const NULL_CACHE_RETRY_TIME = 1000 * 60 * 60 // 1 hour
export class MinimalUsageQueue<T> {
  queue: Map<string, Data<T>> = new Map<string, Data<T>>()
  constructor(private maxSize: number) {}

  add(key: string, value: T | null) {
    if (this.queue.size >= this.maxSize) {
      this.queue.delete(this.queue.keys().next().value)
    }
    this.queue.set(key, { data: value, insertedAt: new Date() })
  }

  protected getFullData(key: string) {
    const data = this.queue.get(key)
    if (data !== undefined) {
      // Move the key to the end of the queue
      this.queue.delete(key)
      this.queue.set(key, data)
    }
    if (data && data.data === null) {
      const shouldRetry =
        Date.now() - data.insertedAt.getTime() > NULL_CACHE_RETRY_TIME
      if (shouldRetry) {
        this.queue.delete(key)
        return undefined
      }
    }
    return data
  }

  get(key: string) {
    const { data } = this.getFullData(key) || {}
    return data
  }

  has(key: string) {
    return this.queue.has(key)
  }

  dequeue() {
    const firstKey = this.queue.keys().next().value
    if (firstKey) {
      this.queue.delete(firstKey)
    }
  }
}

export class MinimalUsageQueueWithTimeLimit<T> extends MinimalUsageQueue<T> {
  INVALIDATION_TIME = 60 * 1000 // 1 minute
  invalidatedIds: Map<string, Date> = new Map<string, Date>()

  constructor(maxSize: number, private expiresInMins: number) {
    super(maxSize)
    this.expiresInMins = expiresInMins * 60 * 1000
  }

  isExpired(data: Data<T>, key: string) {
    if (this.invalidatedIds.has(key)) {
      const insertedAt = this.invalidatedIds.get(key)?.getTime()
      const isStillInvalidated =
        insertedAt && Date.now() < insertedAt + this.INVALIDATION_TIME
      if (isStillInvalidated) {
        return true
      } else {
        this.invalidatedIds.delete(key)
      }
    }
    if (!data.insertedAt) return true
    return Date.now() - data.insertedAt.getTime() > this.expiresInMins
  }

  invalidateIds(ids: string[]) {
    ids.forEach((id) => this.invalidatedIds.set(id, new Date()))
  }

  get(key: string) {
    const data = super.getFullData(key)
    if (data && this.isExpired(data, key)) {
      this.queue.delete(key)
      return undefined
    }
    return data?.data as T | undefined
  }
}
