import { useCallback } from 'react'

export default function useGetNonce() {
  const getNonce = useCallback(async (address: string) => {
    const { getSubsocialApi } = await import(
      '@/subsocial-query/subsocial/connection'
    )
    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    const nonce = await substrateApi.rpc.system.accountNextIndex(address)
    return nonce
  }, [])

  return getNonce
}
