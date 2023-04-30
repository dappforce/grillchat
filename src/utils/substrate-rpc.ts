import { Keyring } from '@polkadot/api'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { type SafeEventEmitterProvider } from '@web3auth/base'
import { encodeSecretKey } from './account'

export class SubstrateRPC {
  private provider: SafeEventEmitterProvider

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider
    cryptoWaitReady()
  }

  async getPrivateKey(): Promise<[string, string]> {
    try {
      const privateKey = (await this.provider.request({
        method: 'private_key',
      })) as string
      const keyring = new Keyring({ ss58Format: 42, type: 'sr25519' })

      const keyPair = keyring.addFromUri('0x' + privateKey)

      // keyPair.address is the account address.
      const account = keyPair?.address

      return [encodeSecretKey(`${privateKey}`), account]
    } catch (error) {
      throw error
    }
  }
}
