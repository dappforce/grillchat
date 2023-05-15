import { getDiscussionCreatorMnemonic } from '@/utils/env/server'
import { Keyring } from '@polkadot/api'
import { cryptoWaitReady } from '@polkadot/util-crypto'

import { KeyringPair } from '@polkadot/keyring/types'

export type WalletClientAccounts = {
  discussionCreator: KeyringPair | null
}

export class WalletClient {
  private static instance: WalletClient

  private accs: WalletClientAccounts = {
    discussionCreator: null,
  }

  static getInstance(): WalletClient {
    if (!WalletClient.instance) {
      WalletClient.instance = new WalletClient()
    }
    return WalletClient.instance
  }

  public static async createKeyringPairFromMnem(mnem: string) {
    if (!(await cryptoWaitReady())) {
      throw 'cryptoWaitReady() resolved to false'
    }
    if (!mnem) {
      throw 'suri cannot be undefined'
    }
    let keyring = new Keyring({ type: 'sr25519' })
    return keyring.addFromUri(mnem)
  }

  public static async createKeyringPairFromSeed(seed: Uint8Array) {
    if (!(await cryptoWaitReady())) {
      throw 'cryptoWaitReady() resolved to false'
    }
    if (!seed) {
      throw 'suri cannot be undefined'
    }
    let keyring = new Keyring({ type: 'sr25519' })
    return keyring.addFromSeed(seed)
  }

  public clientValid(): boolean {
    return !!this.accs.discussionCreator
  }

  get account() {
    if (!this.clientValid()) throw Error('WalletClient is not initialized yet.')

    return {
      discussionCreator: this.accs.discussionCreator!,
    }
  }

  public async init(): Promise<WalletClient> {
    if (this.clientValid()) return this
    this.accs.discussionCreator = await WalletClient.createKeyringPairFromMnem(
      getDiscussionCreatorMnemonic()
    )
    return this
  }
}
