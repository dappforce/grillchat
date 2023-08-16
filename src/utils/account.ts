import { useMyAccount } from '@/stores/my-account'
import type { Keyring } from '@polkadot/keyring'

export type Signer = ReturnType<Keyring['addFromSeed']>

async function getKeyring() {
  const { Keyring } = await import('@polkadot/keyring')
  const { waitReady } = await import('@polkadot/wasm-crypto')
  await waitReady()

  const keyring = new Keyring({ type: 'sr25519' })
  return keyring
}

export async function generateAccount() {
  const { mnemonicGenerate } = await import('@polkadot/util-crypto')
  const keyring = await getKeyring()

  const mnemonic = mnemonicGenerate()
  const pair = keyring.addFromMnemonic(mnemonic, {}, 'sr25519')

  return { publicKey: pair.address, secretKey: mnemonic }
}

export function isSecretKeyUsingMiniSecret(secretKey: string) {
  return secretKey.length === 64
}

export async function loginWithSecretKey(secretKey: string): Promise<Signer> {
  const keyring = await getKeyring()

  if (isSecretKeyUsingMiniSecret(secretKey)) {
    const secret = Buffer.from(secretKey, 'hex')
    const signer = keyring.addFromSeed(secret, {}, 'sr25519')
    return signer
  }

  const signer = keyring.addFromMnemonic(secretKey, {}, 'sr25519')
  return signer
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-6)}`
}

export function encodeSecretKey(secretKey: string) {
  let buffer
  if (isSecretKeyUsingMiniSecret(secretKey))
    buffer = Buffer.from(secretKey, 'hex')
  else buffer = Buffer.from(secretKey)

  return encodeURIComponent(buffer.toString('base64'))
}

export function decodeSecretKey(encodedSecretKey: string) {
  const buffer = Buffer.from(decodeURIComponent(encodedSecretKey), 'base64')
  const hexString = buffer.toString('hex')
  if (isSecretKeyUsingMiniSecret(hexString)) return hexString
  return buffer.toString()
}

export async function validateAddress(address: string) {
  const { decodeAddress, encodeAddress } = await import('@polkadot/keyring')
  const { hexToU8a, isHex } = await import('@polkadot/util')

  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))
    return true
  } catch (error) {
    return false
  }
}

export async function signMessage(message: string) {
  const { u8aToHex } = await import('@polkadot/util')
  const { address, signer } = useMyAccount.getState()

  if (!address) {
    throw new Error('No account connected')
  }

  if (!signer) {
    throw new Error('No signer connected')
  }

  return u8aToHex(signer.sign(message))
}
