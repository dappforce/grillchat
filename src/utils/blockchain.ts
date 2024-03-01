export async function getNewIdFromTxResult(txResult: any) {
  const { getNewIdsFromEvent } = await import('@subsocial/api/utils')
  const [newId] = getNewIdsFromEvent(txResult)
  const newIdString = newId.toString()
  return newIdString
}

export async function waitNewBlock() {
  const { getSubsocialApi } = await import(
    '@/subsocial-query/subsocial/connection'
  )
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
}
