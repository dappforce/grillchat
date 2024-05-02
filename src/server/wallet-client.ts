import { env } from '@/env.mjs'
import { Signer } from '@/utils/account'
import { Wallet } from 'ethers'

export type WalletClientAccounts = {
  discussionCreator: Signer | null
}

export class WalletManager {
  private static instance: WalletManager

  private accs: WalletClientAccounts = {
    discussionCreator: null,
  }

  static async getInstance(): Promise<WalletManager> {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager()
      await WalletManager.instance.init()
    }
    return WalletManager.instance
  }

  public static async createKeyringPairFromMnem(mnem: string) {
    if (!mnem) {
      throw 'suri cannot be undefined'
    }
    return Wallet.fromPhrase(mnem)
  }

  public clientValid(): boolean {
    return !!this.accs.discussionCreator
  }

  get account() {
    if (!this.clientValid())
      throw Error('WalletManager is not initialized yet.')

    return {
      discussionCreator: this.accs.discussionCreator!,
    }
  }

  public async init(): Promise<WalletManager> {
    if (this.clientValid()) return this
    this.accs.discussionCreator = await WalletManager.createKeyringPairFromMnem(
      env.SERVER_DISCUSSION_CREATOR_MNEMONIC
    )
    return this
  }
}
