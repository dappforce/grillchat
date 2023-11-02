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
        return toSubsocialAddress((proxyData[0] as any)?.delegate)!
      }
    })
    .filter(Boolean) as string[]
}

export const getProxiesQuery = createSubsocialQuery({
  key: 'getProxies',
  fetcher: getProxies,
})
