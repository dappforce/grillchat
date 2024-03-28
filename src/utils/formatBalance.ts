import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BigNumber from 'bignumber.js'

export const getBalanceInDollars = (balance?: string, price?: string | null) =>
  price && balance
    ? new BigNumber(price).multipliedBy(new BigNumber(balance)).toFixed(4)
    : '0'

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

  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })
}

export function formatBalanceWithDecimals(
  value: string,
  config?: { decimals?: number; precision?: number; shorten?: boolean }
) {
  let {
    decimals: decimalAmt = 10,
    precision = 2,
    shorten = true,
  } = config || {}
  let parsedValue = BigNumber(value).div(10 ** decimalAmt)
  let roundings = ''

  if (parsedValue.gte(1000000) && shorten) {
    parsedValue = parsedValue.div(1000000)
    roundings = 'm'
  } else if (parsedValue.gte(1000) && shorten) {
    parsedValue = parsedValue.div(1000)
    roundings = 'k'
  }

  let [prefix, postfix = '0'] = parsedValue.toString().split('.')
  let decimals = ''

  if (precision > 0 && postfix !== '0') {
    decimals = BigNumber(`0.${postfix}`).toPrecision(precision)
    if (BigNumber(decimals).gte(1)) {
      prefix = BigNumber(prefix).plus(1).toFixed(0)
      decimals = BigNumber(decimals).minus(1).toPrecision(precision)
    }
    if (BigNumber(decimals).isZero()) {
      decimals = ''
    }
    if (prefix !== '0') {
      decimals = decimals.substring(2)
    }
  }

  return `${prefix}${decimals ? `.${decimals}` : ''}${roundings}`
}
