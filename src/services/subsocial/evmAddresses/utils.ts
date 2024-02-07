import { getNetwork } from '@/utils/network'

export function getEvmPalletName() {
  return getNetwork() === 'xsocial' ? 'evmAccounts' : 'evmAddresses'
}
