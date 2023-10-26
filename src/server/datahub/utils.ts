import { RATE_LIMIT_EXCEEDED } from '@/constants/error'
import { getDatahubMutationConfig } from '@/utils/env/server'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

export function datahubMutationRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const { url, token } = getDatahubMutationConfig() || {}
  if (!url) throw new Error('Datahub (Mutation) config is not set')

  const TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(url, {
    timeout: TIMEOUT,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...config,
  })

  return client.request({ url, ...config })
}

export function datahubMutationWrapper<
  T extends (...args: any[]) => Promise<any>
>(func: T) {
  return async (...args: Parameters<T>) => {
    if (!getDatahubMutationConfig()) return
    try {
      return await func(...args)
    } catch (err) {
      const errors = (err as any)?.response?.errors
      if (Array.isArray(errors)) {
        const rateLimitError = errors.find(
          (e: any) => e?.code === 'TOO_MANY_REQUESTS_PER_TIME_RANGE'
        ) as any
        const rateLimitData = rateLimitError?.payload
        if (rateLimitError) {
          const range = Math.max(rateLimitData.msRange / 1000, 1)
          const timeLeft = Math.max(rateLimitData.msBeforeNext / 1000, 1)
          throw new RateLimitError(
            `You can only send ${
              rateLimitData.maxPoints
            } messages per ${range} seconds${
              timeLeft > 1 ? `(${timeLeft} seconds remaining)` : ''
            }`,
            timeLeft
          )
        }
      }
      throw err
    }
  }
}

export class RateLimitError extends Error {
  constructor(message: string, public remainingSeconds: number) {
    super(message)
    this.name = RATE_LIMIT_EXCEEDED
  }
}
