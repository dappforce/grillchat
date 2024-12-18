export async function getNewIdFromTxResult(txResult: any) {
  const { getNewIdsFromEvent } = await import('@subsocial/api/utils')
  const [newId] = getNewIdsFromEvent(txResult)
  const newIdString = newId.toString()
  return newIdString
}
