import { getModerationUrl } from '@/utils/env/client'
import request, { RequestOptions, Variables } from 'graphql-request'

export function createModerationRequest() {
  return <T, V extends Variables = Variables>(config: RequestOptions<V, T>) => {
    return request({ url: getModerationUrl(), ...config })
  }
}
