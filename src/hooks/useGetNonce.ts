import { useMyAccount } from '@/stores/my-account'
import { useCallback } from 'react'

export default function useGetNonce() {
  const myAddress = useMyAccount((state) => state.address)
  const getNonce = useCallback(async () => {
    if (!myAddress) return null

    const { getSubsocialApi } = await import(
      '@/subsocial-query/subsocial/connection'
    )
    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    const nonce = await substrateApi.rpc.system.accountNextIndex(myAddress)
    return nonce.toNumber()
  }, [myAddress])

  return getNonce
}
