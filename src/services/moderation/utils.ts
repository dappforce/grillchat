import { MODERATION_URL } from '@/constants/moderation'
import request, { RequestOptions, Variables } from 'graphql-request'

export function createModerationRequest() {
  return <T, V extends Variables = Variables>(config: RequestOptions<V, T>) => {
    return request({ url: MODERATION_URL, ...config })
  }
}
