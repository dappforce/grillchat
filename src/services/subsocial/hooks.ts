import { useMyAccount } from '@/stores/my-account'
import { Signer } from '@/utils/account'

type WalletAccount = {
  address: string
  signer: Signer | null
  proxyToAddress?: string
}

export function getCurrentWallet(): WalletAccount {
  return {
    address: useMyAccount.getState().address ?? '',
    signer: useMyAccount.getState().signer,
    proxyToAddress: useMyAccount.getState().parentProxyAddress,
  }
}
