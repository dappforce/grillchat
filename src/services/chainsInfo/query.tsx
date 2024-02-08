import { createQuery, poolQuery } from '@/subsocial-query'
import { useMemo } from 'react'
import { getSubIdRequest } from '../external'
import { ChainInfo } from './types'

export async function getChainsInfo() {
  return getSubIdRequest().get('/chains/properties')
}

export const useGetChainDataByNetwork = (network: string) => {
  const { data: chainInfo, status } = getChainsInfoQuery.useQuery(network)

  return useMemo(() => {
    if (status !== 'success') return

    const { tokenDecimals, tokenSymbols, nativeToken, ...otherData } =
      chainInfo || {}

    const tokenSymbol = tokenSymbols?.[0] || nativeToken

    const decimal = tokenDecimals?.[0] || 0

    return { decimal, tokenSymbol, ...otherData }
  }, [status, network])
}

const getChainsInfoCall = poolQuery<string, ChainInfo>({
  multiCall: async () => {
    const result = await getChainsInfo()

    const chainsInfo = result.data

    return chainsInfo
      ? Object.entries(chainsInfo).map(([network, chainInfo]) => {
          return { id: network, ...(chainInfo as any) }
        })
      : []
  },
  resultMapper: {
    paramToKey: (id) => id,
    resultToKey: (item) => item.id,
  },
})
export const getChainsInfoQuery = createQuery({
  key: 'chainsInfo',
  fetcher: getChainsInfoCall,
})
