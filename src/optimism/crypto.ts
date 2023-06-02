import { Signer } from '@/utils/account'
import { stringToU8a, u8aToHex } from '@polkadot/util'
import { sortObj } from 'jsonabc'

/** Sorts object keys alphabetically and stringify as JSON. */
const stingifySorted = (obj: Object) => {
  return JSON.stringify(sortObj(obj))
}

/** Signs a message object and returns the signature as a hex string. */
export const signMessage = (signer: Signer, message: Object): string => {
  const messageBytes = stringToU8a(stingifySorted(message))
  const signatureBytes = signer.sign(messageBytes)
  return u8aToHex(signatureBytes)
}

// TODO need to write unit tests
