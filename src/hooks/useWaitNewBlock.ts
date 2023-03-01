import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { useCallback } from 'react'

export default function useWaitNewBlock() {
  const waitNewBlock = useCallback(async () => {
    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    const currentBlock = await substrateApi.rpc.chain.getBlock()
    return new Promise<void>((resolve) => {
      const unsubscribe = substrateApi.rpc.chain.subscribeNewHeads((result) => {
        if (result.number > currentBlock.block.header.number) {
          unsubscribe.then((unsub) => unsub())
          resolve()
        }
      })
    })
  }, [])

  return waitNewBlock
}
