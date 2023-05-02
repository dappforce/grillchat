import type { Keyring } from '@polkadot/keyring'

export type Signer = ReturnType<Keyring['addFromSeed']>

async function getKeyring() {
  const { Keyring } = await import('@polkadot/keyring')
  const { cryptoWaitReady } = await import('@polkadot/util-crypto')
  await cryptoWaitReady()

  const keyring = new Keyring({ type: 'sr25519' })
  return keyring
}

export async function generateAccount() {
  const { mnemonicGenerate, mnemonicToMiniSecret } = await import(
    '@polkadot/util-crypto'
  )
  const keyring = await getKeyring()

  const mnemonic = mnemonicGenerate()
  const seed = mnemonicToMiniSecret(mnemonic)
  const pair = keyring.addFromSeed(seed, {}, 'sr25519')

  const secretKey = Buffer.from(seed).toString('hex')
  return { publicKey: pair.address, secretKey }
}

export async function loginWithSecretKey(secretKey: string): Promise<Signer> {
  const keyring = await getKeyring()

  const secret = Buffer.from(secretKey, 'hex')
  const signer = keyring.addFromSeed(secret, {}, 'sr25519')
  return signer
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}

export function encodeSecretKey(secretKey: string) {
  return encodeURIComponent(Buffer.from(secretKey, 'hex').toString('base64'))
}

export function decodeSecretKey(encodedSecretKey: string) {
  return Buffer.from(decodeURIComponent(encodedSecretKey), 'base64').toString(
    'hex'
  )
}

export async function convertHexAddressToSubstrateAddress(hexAddress: string) {
  const { encodeAddress } = await import('@polkadot/keyring')
  return encodeAddress(hexAddress, 42)
}
