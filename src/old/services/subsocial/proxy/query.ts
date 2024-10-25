import {
  createSubsocialQuery,
  SubsocialQueryData,
} from '@/old/subsocial-query/subsocial/query'
import { convertAddressToSubsocialAddress } from '@/utils/account'

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
          address: convertAddressToSubsocialAddress(data?.delegate)!,
          proxyType: data?.proxyType,
        }
      }
      return null
    })
    .filter((data) => !!data?.address) as {
    address: string
    proxyType: string
  }[]
}

export const getProxiesQuery = createSubsocialQuery({
  key: 'getProxies',
  fetcher: getProxies,
})
