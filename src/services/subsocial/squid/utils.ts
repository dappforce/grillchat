import { getSquidUrl } from '@/utils/env/client'
import request, { RequestOptions, Variables } from 'graphql-request'

export function squidRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const url = getSquidUrl()
  if (!url) throw new Error('Squid URL is not defined')

  return request({ url, ...config })
}
