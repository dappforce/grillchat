import { getGeneralEraInfoData } from '@/old/services/contentStaking/generalErainfo/query'
import { cx } from '@/utils/class-names'
import { pluralize } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useBlockNumberContext } from './BlockNumberContext'
import { sectionBg } from './SectionWrapper'

export const formatTime = (seconds: number) => {
  const timeUnits = [
    { divisor: 86400, label: 'day' },
    { divisor: 3600, label: 'hour' },
    { divisor: 60, label: 'minute' },
    { divisor: 1, label: 'second' },
  ]

  for (const unit of timeUnits) {
    const { divisor, label } = unit

    if (seconds >= divisor) {
      const value = Math.floor(seconds / divisor)
      return pluralize({ count: value, singularText: label })
    }
  }
}

export const useGetOneEraTime = () => {
  const { data: eraInfo } = getGeneralEraInfoData()
  const { blockTime } = useBlockNumberContext()

  const { blockPerEra } = eraInfo || {}

  const timeInEra =
    blockPerEra && blockTime
      ? new BN(blockPerEra).multipliedBy(new BN(blockTime).dividedBy(1000))
      : undefined

  return timeInEra
}

type DaysToUnstakeProps = {
  unbondingPeriodInEras?: string
}

export const DaysToWithdraw = ({
  unbondingPeriodInEras,
}: DaysToUnstakeProps) => {
  const timeInEra = useGetOneEraTime()

  const unbondingPeriodInDays = timeInEra?.multipliedBy(
    unbondingPeriodInEras || '0'
  )

  return <>{formatTime(unbondingPeriodInDays?.toNumber() || 0)}</>
}

export const DaysToWithdrawWarning = ({
  unbondingPeriodInEras,
}: DaysToUnstakeProps) => {
  return (
    <div className={cx('rounded-2xl px-4 py-2 text-text-primary', sectionBg)}>
      ℹ️ Unlocking takes about{' '}
      <DaysToWithdraw unbondingPeriodInEras={unbondingPeriodInEras} /> before
      you can withdraw
    </div>
  )
}
