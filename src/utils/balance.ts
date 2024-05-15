import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'ethers'

export const getBalanceInDollars = (balance?: string, price?: string | null) =>
  price && balance ? new BigNumber(price).multipliedBy(balance).toFixed(4) : '0'

export function useFormatBalance({
  network,
  value,
  toFixed,
}: {
  network: string
  value: string
  toFixed: number
}) {
  const chainData = useGetChainDataByNetwork(network)
  const { decimal, tokenSymbol } = chainData || {}

  const formattedValue = formatUnits(value, decimal)
  const balanceValueBN = new BigNumber(formattedValue)

  return {
    formattedValue: balanceValueBN.toFixed(toFixed),
    tokenSymbol,
  }
}

export function formatBalance({
  value,
  toFixed = 2,
  toPrecision,
}: {
  value: string
  toFixed?: number
  toPrecision?: number
}) {
  const [prefix, postfix] = value.split('.')
  let afterDecimalPoint = postfix
  if (toPrecision) {
    afterDecimalPoint = parseFloat(`0.${postfix}`)
      .toPrecision(toPrecision)
      .substring(2)
  } else if (toFixed) {
    afterDecimalPoint = postfix
      .substring(0, toFixed)
      .padEnd(toFixed, '0')
      .substring(0, toFixed)
  }

  if (afterDecimalPoint === '0') {
    return prefix
  }

  return `${prefix}.${afterDecimalPoint}`
}
