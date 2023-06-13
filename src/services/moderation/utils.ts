import { getModerationUrl } from '@/utils/env/client'
import request, { RequestOptions, Variables } from 'graphql-request'

export function moderationRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  return request({ url: getModerationUrl(), ...config })
}
