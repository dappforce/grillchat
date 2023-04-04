import type { Keyring } from '@polkadot/keyring'

export type Signer = ReturnType<Keyring['addFromSeed']>

export async function generateAccount() {
  const { mnemonicGenerate, mnemonicToMiniSecret, cryptoWaitReady } =
    await import('@polkadot/util-crypto')
  const { Keyring } = await import('@polkadot/keyring')
  const { toSubsocialAddress } = await import('@subsocial/utils')
  await cryptoWaitReady()

  const mnemonic = mnemonicGenerate()
  const seed = mnemonicToMiniSecret(mnemonic)
  const keyring = new Keyring({ type: 'sr25519' })
  const pair = keyring.addFromSeed(seed, {}, 'sr25519')

  const secretKey = Buffer.from(seed).toString('hex')
  return { publicKey: toSubsocialAddress(pair.address)!, secretKey }
}

export async function loginWithSecretKey(secretKey: string): Promise<Signer> {
  const { Keyring } = await import('@polkadot/keyring')
  const { cryptoWaitReady } = await import('@polkadot/util-crypto')
  await cryptoWaitReady()

  const keyring = new Keyring({ type: 'sr25519' })
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
