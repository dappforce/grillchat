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
  return (...args: Parameters<T>) => {
    if (!getDatahubMutationConfig()) return
    return func(...args)
  }
}
