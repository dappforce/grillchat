/**
 * A queue that only keeps the last N elements.
 * If the queue is full, the least used element is removed.
 */
export class MinimalUsageQueue<T> {
  queue: Map<string, T> = new Map<string, T>()
  constructor(private maxSize: number) {}

  add(key: string, value: T) {
    if (this.queue.size >= this.maxSize) {
      this.queue.delete(this.queue.keys().next().value)
    }
    this.queue.set(key, value)
  }

  get(key: string) {
    const data = this.queue.get(key)
    if (data) {
      this.queue.delete(key)
      this.queue.set(key, data)
    }
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
