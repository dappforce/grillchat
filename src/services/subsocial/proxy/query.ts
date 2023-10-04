import {
  createSubsocialQuery,
  SubsocialQueryData,
} from '@/subsocial-query/subsocial/query'

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
        return (proxyData[0] as any)?.delegate
      }
    })
    .filter(Boolean)
}

export const getProxiesQuery = createSubsocialQuery({
  key: 'getProxies',
  fetcher: getProxies,
})
