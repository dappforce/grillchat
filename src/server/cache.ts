import { env } from '@/env.mjs'
import Redis, { RedisOptions } from 'ioredis'

export function getRedisConfig() {
  const host = env.REDIS_HOST
  const port = env.REDIS_PORT
  const password = env.REDIS_PASSWORD

  const parsedPort = parseInt(port)

  if (!host || !port || isNaN(parsedPort) || !password) {
    throw new Error(
      'Redis configuration is not complete, need host, port, password'
    )
  }

  return { host, port: parsedPort, password }
}

export function createRedisInstance() {
  try {
    const config = getRedisConfig()

    const options: RedisOptions = {
      host: config.host,
      password: config.password,
      port: config.port,

      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      commandTimeout: 250,
      retryStrategy: (times: number) => {
        return Math.min(times * 200, 1000)
      },
    }

    const redis = new Redis(options)

    redis.on('error', (error: any) => {
      console.warn('[Redis] Warning: error connecting to redis', error?.message)
    })

    return redis
  } catch (e) {
    console.error(`[Redis] Could not create a Redis instance`)
    return null
  }
}

const redis = createRedisInstance()
export async function redisCallWrapper<T = void>(
  callback: (redis: Redis | null) => Promise<T> | undefined
) {
  try {
    return await callback(redis)
  } catch (err: any) {
    console.warn('[Redis] Warning: operation failed', err?.message)
    return null
  }
}
