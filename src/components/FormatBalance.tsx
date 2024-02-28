import { formatBalance } from '@/utils/formatBalance'
import SkeletonFallback from './SkeletonFallback'

type FormatBalanceProps = {
  value: string
  defaultMaximumFractionDigits?: number
  symbol?: string
  loading?: boolean
  startFromSymbol?: boolean
}

const FormatBalance = ({
  value,
  defaultMaximumFractionDigits,
  loading,
  startFromSymbol: startFromSybmol,
  symbol,
}: FormatBalanceProps) => {
  const formattedValue = formatBalance({
    value: value,
    defaultMaximumFractionDigits,
  })

  const formattedValueWithSymbol = startFromSybmol
    ? `${symbol}${formattedValue}`
    : `${formattedValue} ${symbol}`

  return (
    <SkeletonFallback isLoading={loading}>
      {symbol ? formattedValueWithSymbol : formattedValue}
    </SkeletonFallback>
  )
}

export default FormatBalance
