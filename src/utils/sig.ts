import { Signer } from '@/utils/account'
import { u8aToHex } from '@polkadot/util'
import sortKeys from 'sort-keys-recursive'

export function augmentInputSig(
  signer: Signer | null,
  payload: { sig: string; providerAddr: string }
) {
  if (!signer) throw new Error('Signer is not defined')
  // TODO: quick fix for now, need to refactor
  // @ts-ignore
  payload.dataType = 'offChain'
  payload.providerAddr = signer.address

  const sortedPayload = sortKeys(payload)
  console.log('sortedPayload', JSON.stringify(sortedPayload))
  const sig = signer.sign(JSON.stringify(sortedPayload))
  const hexSig = u8aToHex(sig)
  payload.sig = hexSig
  console.log('hexSig', JSON.stringify(payload))
}
