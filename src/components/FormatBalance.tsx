import { formatBalance } from '@/utils/formatBalance'
import SkeletonFallback from './SkeletonFallback'

type FormatBalanceProps = {
  value: string
  defaultMaximumFractionDigits?: number
  symbol?: string
  loading?: boolean
  startFromSymbol?: boolean
  className?: string
}

const FormatBalance = ({
  value,
  defaultMaximumFractionDigits,
  loading,
  startFromSymbol: startFromSybmol,
  symbol,
  className,
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
      <span className={className}>
        {symbol ? formattedValueWithSymbol : formattedValue}
      </span>
    </SkeletonFallback>
  )
}

export default FormatBalance
