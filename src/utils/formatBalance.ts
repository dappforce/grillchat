import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BigNumber from 'bignumber.js'

export const getBalanceInDollars = (balance?: string, price?: string | null) =>
  price && balance ? new BigNumber(price).multipliedBy(new BigNumber(balance)).toFixed(4) : '0'

export const parseBalance = (balance?: string, decimals?: number) => {
  if (!balance || !decimals) return '0'

  const balanceWithDecimal = convertToBalanceWithDecimal(balance, decimals)

  return balanceWithDecimal.toFixed(4)
}

type FormatBalance = {
  value: string
  defaultMaximumFractionDigits?: number
}

export const formatBalance = ({
  value,
  defaultMaximumFractionDigits = 2,
}: FormatBalance) => {
  const [intPart, decimalPart] = value.split('.')

  let maximumFractionDigits = defaultMaximumFractionDigits

  if (intPart === '0' && Number(decimalPart) > 0) {
    const firstNonZeroIndex =
      decimalPart.split('').findIndex((char) => char !== '0') + 1

    if (firstNonZeroIndex > 5) {
      maximumFractionDigits = defaultMaximumFractionDigits
    } else {
      maximumFractionDigits = firstNonZeroIndex
    }
  }

  return Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })
}
