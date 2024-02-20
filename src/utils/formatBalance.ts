import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BigNumber from 'bignumber.js'

export const getBalanceInDollars = (balance?: string, price?: string | null) =>
  price && balance ? new BigNumber(price).multipliedBy(balance).toFixed(4) : '0'

export const formatBalance = (balance?: string, decimals?: number) => {
  if (!balance || !decimals) return '0'

  const balanceWithDecimal = convertToBalanceWithDecimal(balance, decimals)

  return balanceWithDecimal.toFixed(4)
}