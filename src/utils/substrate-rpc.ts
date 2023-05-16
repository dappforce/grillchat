import { Keyring } from '@polkadot/api'
import { CHAIN_NAMESPACES, type SafeEventEmitterProvider } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { encodeSecretKey } from './account'
import { getWeb3AuthClientId } from './env/client'

const clientId = getWeb3AuthClientId()
export async function initializeWeb3Auth() {
  const web3auth = new Web3Auth({
    clientId,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.OTHER,
      // chainId: '0x5',
      // rpcTarget: 'https://rpc.ankr.com/eth_goerli',
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
    privateKey?: string
    address?: string
  }> {
    try {
      const privateKey = (await this.provider.request({
        method: 'private_key',
      })) as string
      const keyring = new Keyring({ ss58Format: 42, type: 'sr25519' })

      const keyPair = keyring.addFromUri('0x' + privateKey)

      // keyPair.address is the account address.
      const account = keyPair?.address

      return { privateKey: encodeSecretKey(`${privateKey}`), address: account }
    } catch (error) {
      console.log({ error })
      return {}
    }
  }
}
