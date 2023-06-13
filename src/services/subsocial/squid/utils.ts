import { getSquidUrl } from '@/utils/env/client'
import request, { RequestOptions, Variables } from 'graphql-request'

export function squidRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  return request({ url: getSquidUrl(), ...config })
}
