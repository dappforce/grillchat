import { HDNodeWallet } from 'ethers'

export type Signer = HDNodeWallet

export async function generateAccount() {
  const { Wallet } = await import('ethers')
  const wallet = Wallet.createRandom()
  return { publicKey: wallet.address, secretKey: wallet.mnemonic?.phrase ?? '' }
}

export function isSecretKeyUsingMiniSecret(secretKey: string) {
  return secretKey.length === 64
}

export async function loginWithSecretKey(
  secretKey: string
): Promise<HDNodeWallet> {
  const { Wallet } = await import('ethers')
  return Wallet.fromPhrase(secretKey)
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function encodeSecretKey(secretKey: string) {
  let buffer = Buffer.from(secretKey)
  return encodeURIComponent(buffer.toString('base64'))
}

export function decodeSecretKey(encodedSecretKey: string) {
  const buffer = Buffer.from(decodeURIComponent(encodedSecretKey), 'base64')
  return buffer.toString()
}

export async function validateAddress(address: string) {
  const { isAddress } = await import('ethers')
  return isAddress(address)
}
