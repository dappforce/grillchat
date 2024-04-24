import { useMyAccount } from '@/stores/my-account'
import { WalletAccount } from '@/subsocial-query/subsocial/types'

export function getCurrentWallet(): WalletAccount {
  return {
    address: useMyAccount.getState().address ?? '',
    signer: useMyAccount.getState().signer,
    proxyToAddress: useMyAccount.getState().parentProxyAddress,
  }
}
