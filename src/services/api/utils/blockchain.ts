import { ApiPromise } from '@polkadot/api'
import { DispatchError } from '@polkadot/types/interfaces/system/types'

export function getTxSubDispatchErrorMessage(
  error: DispatchError,
  api: ApiPromise
): string {
  let errorMsg = ''
  if (error.isModule) {
    // for module errors, we have the section indexed, lookup
    const decoded = api.registry.findMetaError(error.asModule)
    const { docs, name, section } = decoded
    console.log(`${section}.${name}: ${docs.join(' ')}`)
    errorMsg = `${section}.${name}: ${docs.join(' ')}`
  } else {
    // Other, CannotLookup, BadOrigin, no extra info
    console.log(error.toString())
    errorMsg = error.toString()
  }
  return errorMsg
}
