import { CacheHandler } from '@neshca/cache-handler'
import createLruHandler from '@neshca/cache-handler/local-lru'
import createRedisHandler from '@neshca/cache-handler/redis-stack'
import { createClient } from 'redis'

const redisUrl = `redis://${process.env.REDIS_HOST ?? 'localhost'}:${
  process.env.REDIS_PORT ?? 6379
}`
CacheHandler.onCreation(async () => {
  // always create a Redis client inside the `onCreation` callback
  const client = createClient({
    url: redisUrl,
    password: process.env.REDIS_PASSWORD,
  })

  client.on('error', () => {})

  await client.connect()

  const redisHandler = await createRedisHandler({
    client,
    // timeout for the Redis client operations like `get` and `set`
    // after this timeout, the operation will be considered failed and the `localHandler` will be used
    timeoutMs: 5000,
  })

  const localHandler = createLruHandler()

  return {
    handlers: [redisHandler, localHandler],
  }
})

export default CacheHandler
