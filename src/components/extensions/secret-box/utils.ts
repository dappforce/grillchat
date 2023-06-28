import { decodeSecretKey } from '@/utils/account'
import { stringToU8a, u8aToHex } from '@polkadot/util'

async function convertAddressToPublicKey(address: string) {
  const { decodeAddress } = await import('@polkadot/keyring')
  return decodeAddress(address)
}

export async function encodeSecretBox(
  message: string,
  senderEncodedSecretKey: string,
  recipient: string,
  nonce: number
): Promise<string> {
  const { naclSeal } = await import('@subsocial/utils')
  const secretKey = decodeSecretKey(senderEncodedSecretKey)

  const publicKey = await convertAddressToPublicKey(recipient)

  const seal = naclSeal(
    stringToU8a(message),
    stringToU8a(secretKey),
    publicKey,
    stringToU8a(nonce.toString())
  )
  return u8aToHex(seal.sealed)
}

export async function decodeSecretBox(
  encrypted: string,
  sender: string,
  recipientEncodedSecretKey: string,
  nonce: number
): Promise<string> {
  const { naclOpen } = await import('@subsocial/utils')
  const recipientSecretKey = decodeSecretKey(recipientEncodedSecretKey)

  const publicKey = await convertAddressToPublicKey(sender)

  const open = naclOpen(
    stringToU8a(encrypted),
    stringToU8a(nonce.toString()),
    publicKey,
    stringToU8a(recipientSecretKey)
  )
  return u8aToHex(open)
}
