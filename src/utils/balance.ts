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

export function useFormatSUB({
  value,
  toFixed,
}: {
  value: string
  toFixed: number
}) {
  const formattedValue = formatUnits(value, 10)
  const balanceValueBN = new BigNumber(formattedValue)

  return {
    formattedValue: balanceValueBN.toFixed(toFixed),
    tokenSymbol: 'SUB',
  }
}
