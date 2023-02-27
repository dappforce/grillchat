import { Signer } from './types'

export async function generateAccount() {
  const { ed25519PairFromSeed, mnemonicGenerate, mnemonicToMiniSecret } =
    await import('@polkadot/util-crypto')

  const mnemonicAlice = mnemonicGenerate()
  const seedAlice = mnemonicToMiniSecret(mnemonicAlice)
  const { publicKey: publicKeyBuffer, secretKey: secretKeyBuffer } =
    ed25519PairFromSeed(seedAlice)

  const publicKey = Buffer.from(publicKeyBuffer.buffer).toString('hex')
  const secretKey = Buffer.from(secretKeyBuffer.buffer).toString('hex')
  return { publicKey, secretKey }
}

export async function loginWithSecretKey(secretKey: string): Promise<Signer> {
  const { Keyring } = await import('@polkadot/keyring')
  const keyring = new Keyring({ type: 'sr25519' })
  const secret = Buffer.from(secretKey, 'hex')
  const pair = keyring.addFromSeed(secret, {}, 'ed25519')
  return pair
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}
