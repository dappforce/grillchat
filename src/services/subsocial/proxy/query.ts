import {
  createSubsocialQuery,
  SubsocialQueryData,
} from '@/subsocial-query/subsocial/query'
import { toSubsocialAddress } from '@subsocial/utils'

async function getProxies({
  api,
  data,
}: SubsocialQueryData<{ address: string }>) {
  const substrateApi = await api.substrateApi
  const proxies = await substrateApi.query.proxy.proxies(data.address)
  return proxies
    .map((proxy) => {
      const proxyData = proxy.toPrimitive()
      if (Array.isArray(proxyData)) {
        const data = proxyData[0] as any
        return {
          address: toSubsocialAddress(data?.delegate)!,
          proxyType: data?.proxyType,
        }
      }
      return null
    })
    .filter(Boolean) as { address: string; proxyType: string }[]
}

export const getProxiesQuery = createSubsocialQuery({
  key: 'getProxies',
  fetcher: getProxies,
})
