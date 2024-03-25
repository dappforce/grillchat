/**
 * This file is used to create a cache handler for the shared cache.
 * It is used to have a shared cache between multiple instances of the application.
 * https://github.com/vercel/next.js/tree/canary/examples/cache-handler-redis
 */

const { IncrementalCache } = require('@neshca/cache-handler')
const createRedisCache = require('@neshca/cache-handler/redis-stack').default
const createLruCache = require('@neshca/cache-handler/local-lru').default
const { createClient } = require('ioredis')

export function getRedisConfig() {
  const host = process.env.REDIS_HOST
  const port = process.env.REDIS_PORT
  const password = process.env.REDIS_PASSWORD

  const parsedPort = parseInt(port)

  if (!host || !port || isNaN(parsedPort)) {
    throw new Error(
      '[Cache Redis] configuration is not complete, need host, port, password'
    )
  }

  return { host, port: parsedPort, password }
}

export function createRedisInstance() {
  try {
    const config = getRedisConfig()

    const options = {
      host: config.host,
      password: config.password,
      port: config.port,

      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      commandTimeout: 250,
      retryStrategy: (times) => {
        return Math.min(times * 200, 1000)
      },
    }

    const redis = new Redis(options)

    redis.on('error', (error) => {
      console.warn(
        '[Cache Redis] Warning: error connecting to redis',
        error?.message
      )
    })

    return redis
  } catch (e) {
    console.error(`[Cache Redis] Could not create a Redis instance`)
    return null
  }
}

IncrementalCache.onCreation(async () => {
  // read more about TTL limitations https://caching-tools.github.io/next-shared-cache/configuration/ttl
  function useTtl(maxAge) {
    const evictionAge = maxAge * 1.5

    return evictionAge
  }

  let redisCache

  try {
    const client = createRedisInstance()
    console.log('GIT HASH', process.env.GIT_HASH)
    redisCache = await createRedisCache({
      client,
      useTtl,
      keyPrefix: process.env.GIT_HASH,
    })
  } catch (err) {
    console.error('[Cache Redis] Could not create a Redis cache', err)
  }

  const localCache = createLruCache({
    useTtl,
  })

  return {
    cache: [redisCache, localCache],
    // read more about useFileSystem limitations https://caching-tools.github.io/next-shared-cache/configuration/use-file-system
    useFileSystem: false,
  }
})

module.exports = IncrementalCache
