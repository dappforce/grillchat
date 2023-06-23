import { getNotificationsUrl } from '@/utils/env/client'
import request, { RequestOptions, Variables } from 'graphql-request'

export function notificationsRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  return request({ url: getNotificationsUrl(), ...config })
}
