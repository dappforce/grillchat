import { ERRORS } from '@/constants/error'
import { env } from '@/env.mjs'
import { getServerAccount } from '@/old/server/common'
import { signDatahubPayload } from '@/old/services/datahub/utils'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

function getDatahubQueueConfig() {
  return {
    url: env.DATAHUB_QUEUE_URL,
    token: env.DATAHUB_QUEUE_TOKEN,
  }
}

export function datahubQueueRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const { url, token } = getDatahubQueueConfig() || {}
  if (!url) throw new Error('Datahub (Mutation) config is not set')

  const TIMEOUT = 10 * 1000 // 10 seconds
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
    if (!getDatahubQueueConfig()) return
    try {
      return await func(...args)
    } catch (err) {
      const errors = (err as any)?.response?.errors
      if (!Array.isArray(errors)) throw err

      const errorCodesMap = {
        TOO_MANY_REQUESTS_PER_TIME_RANGE: 'TOO_MANY_REQUESTS_PER_TIME_RANGE',
        CREATE_POST_PERMISSIONS_DENIED: 'CREATE_POST_PERMISSIONS_DENIED',
        CREATE_COMMENT_PERMISSIONS_DENIED: 'CREATE_COMMENT_PERMISSIONS_DENIED',
      }
      const foundError = errors.find(
        (e: any) => errorCodesMap[(e?.code ?? '') as keyof typeof errorCodesMap]
      ) as any
      if (!foundError) {
        throw err
      }

      switch (foundError.code) {
        case errorCodesMap.TOO_MANY_REQUESTS_PER_TIME_RANGE:
          const rateLimitData = foundError?.payload
          const range = Math.max(rateLimitData.msRange / 1000, 1)
          const timeLeft = Math.max(rateLimitData.msBeforeNext / 1000, 1)
          throw new RateLimitError(
            `You can only send ${rateLimitData.maxPoints} messages per ${
              range > 1 ? `${range} seconds` : 'second'
            }${timeLeft > 1 ? ` (${timeLeft} seconds remaining)` : ''}`,
            timeLeft
          )
        case errorCodesMap.CREATE_COMMENT_PERMISSIONS_DENIED:
          throw new CreateMessagePermissionDeniedError(
            'You are not allowed to send a message in this chat'
          )
        case errorCodesMap.CREATE_POST_PERMISSIONS_DENIED:
          throw new CreateChatPermissionDeniedError(
            'You are not allowed to create a chat in this hub'
          )
      }
    }
  }
}

export class RateLimitError extends Error {
  constructor(message: string, public remainingSeconds: number) {
    super(message)
    this.name = ERRORS.RATE_LIMIT_EXCEEDED
  }
}

export class CreateMessagePermissionDeniedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = ERRORS.CREATE_MESSAGE_PERMISSION_DENIED
  }
}

export class CreateChatPermissionDeniedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = ERRORS.CREATE_CHAT_PERMISSIONS_DENIED
  }
}

export const backendSigWrapper = async <
  T extends {
    providerAddr: string
    sig: string
  }
>(
  input: T
) => {
  const signer = await getServerAccount()
  if (!signer) throw new Error('Invalid Mnemonic')

  input.providerAddr = signer.address

  signDatahubPayload(signer, input)
  return input
}

export function throwErrorIfNotProcessed(
  data: { processed: boolean; message?: string | null },
  defaultMessage?: string
) {
  if (!data.processed) {
    throw new Error(
      data.message ?? defaultMessage ?? 'Failed to process request'
    )
  }
}
