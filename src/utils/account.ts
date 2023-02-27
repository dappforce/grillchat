export async function generateAccount() {
  const { ed25519PairFromSeed, mnemonicGenerate, mnemonicToMiniSecret } =
    await import('@polkadot/util-crypto')

  const mnemonicAlice = mnemonicGenerate()
  const seedAlice = mnemonicToMiniSecret(mnemonicAlice)
  const { publicKey: publicKeyBuffer, secretKey: secretKeyBuffer } =
    ed25519PairFromSeed(seedAlice)

  const publicKey = Buffer.from(publicKeyBuffer.buffer)
  const secretKey = Buffer.from(secretKeyBuffer.buffer)
  return { publicKey, secretKey }
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}
