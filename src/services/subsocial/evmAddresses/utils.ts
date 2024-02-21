import { currentNetwork } from '@/utils/network'

export function getEvmPalletName() {
  return currentNetwork === 'xsocial' ? 'evmAccounts' : 'evmAddresses'
}
