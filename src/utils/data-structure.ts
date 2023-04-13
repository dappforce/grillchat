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
  constructor(maxSize: number, private expiresInMins: number) {
    super(maxSize)
    this.expiresInMins = expiresInMins * 60 * 1000
  }

  isExpired(data: Data<T>) {
    if (!data.insertedAt) return true
    return Date.now() - data.insertedAt.getTime() > this.expiresInMins
  }

  get(key: string) {
    const data = super.getFullData(key)
    if (data && this.isExpired(data)) {
      this.queue.delete(key)
      return undefined
    }
    return data?.data as T | undefined
  }
}
