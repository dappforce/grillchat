import { Keyring } from '@polkadot/keyring'
import { type SafeEventEmitterProvider } from '@web3auth/base'

import { encodeSecretKey } from './account'
import { getWeb3AuthClientId } from './env/client'

const clientId = getWeb3AuthClientId()
export async function initializeWeb3Auth() {
  const { Web3Auth } = await import('@web3auth/modal')
  const { CHAIN_NAMESPACES } = await import('@web3auth/base')
  const web3auth = new Web3Auth({
    clientId,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.OTHER,
    },
    web3AuthNetwork: 'testnet',
  })
  web3auth.initModal()
  return web3auth
}
async function wait() {
  const { cryptoWaitReady } = await import('@polkadot/util-crypto')
  await cryptoWaitReady()
}

export class SubstrateRPC {
  private provider: SafeEventEmitterProvider

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider
    wait()
  }

  async getPrivateKey(): Promise<{
    encodedSecretKey?: string
    address?: string
  }> {
    try {
      const privateKey = (await this.provider.request({
        method: 'private_key',
      })) as string
      const keyring = new Keyring({ ss58Format: 42, type: 'sr25519' })

      const keyPair = keyring.addFromUri('0x' + privateKey)
      return {
        encodedSecretKey: encodeSecretKey(privateKey),
        address: keyPair.address,
      }
    } catch (error) {
      console.error(error)
      return {}
    }
  }
}
