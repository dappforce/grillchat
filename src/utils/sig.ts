import { Signer } from '@/utils/account'
import { u8aToHex } from '@polkadot/util'
import sortKeys from 'sort-keys-recursive'

export function augmentInputSig(
  signer: Signer | null,
  payload: { sig: string; providerAddr: string }
) {
  if (!signer) throw new Error('Signer is not defined')
  const sortedPayload = sortKeys(payload)
  const sig = signer.sign(JSON.stringify(sortedPayload))
  const hexSig = u8aToHex(sig)
  payload.sig = hexSig
  console.log('hexSig', JSON.stringify(payload))
}
