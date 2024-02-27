import SkeletonFallback from '@/components/SkeletonFallback'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getGeneralEraInfoData } from '@/services/contentStaking/generalErainfo/query'
import { getGeneralStatsData } from '@/services/datahub/generalStats/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { convertToBalanceWithDecimal, isDef } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useMemo } from 'react'
import { getBackerLedgerQuery } from '../../../services/contentStaking/backerLedger/query'
import { StatsCardContent } from '../StatsData/StatsCard'
import { sectionBg } from '../utils/SectionWrapper'

const StatsCards = () => {
  const myAddress = useMyMainAddress()
  const { tokenSymbol, decimal } = useGetChainDataByNetwork('subsocial') || {}

  const { data: info, isLoading: generalEraInfoLoading } =
    getGeneralEraInfoData()
  const { data: ledger, isLoading: ledgerLoading } =
    getBackerLedgerQuery.useQuery(myAddress || '')

  const { data: generalStatsData, isLoading: generalStatsLoading } =
    getGeneralStatsData()

  const stakersEarnedTotal = generalStatsData?.stakersEarnedTotal

  const stakersEarnedTotalBN = stakersEarnedTotal
    ? convertToBalanceWithDecimal(stakersEarnedTotal, decimal || 0)
    : new BN(0)

  const { locked } = ledger || {}

  const myLockWithDecimals = locked
    ? convertToBalanceWithDecimal(locked, decimal || 0)
    : new BN(0)

  const myLock = (
    <>
      {myLockWithDecimals.toFixed(2)} {tokenSymbol}
    </>
  )

  const totalEarnedTokens = (
    <>
      {stakersEarnedTotalBN.toFixed(2)} {tokenSymbol}
    </>
  )

  const dashboardData = useMemo(() => {
    return [
      {
        title: 'My lock',
        value: (
          <SkeletonFallback isLoading={ledgerLoading}>
            {myLock}
          </SkeletonFallback>
        ),
        infoTitle: 'How many tokens you have locked',
        desc: 'asdasdasd',
      },
      {
        title: 'Total SUB earned by stakers',
        value: (
          <SkeletonFallback isLoading={generalStatsLoading}>
            {totalEarnedTokens}
          </SkeletonFallback>
        ),
        infoTitle: 'The total amount of tokens locked on the Subsocial network',
        desc: 'asdasdasd',
      },
      {
        title: 'Total participants',
        value: (
          <SkeletonFallback isLoading={generalEraInfoLoading}>
            {info?.backerCount}
          </SkeletonFallback>
        ),
        infoTitle: 'The total number of unique accounts currently locking SUB',
      },
    ].filter(isDef)
  }, [generalEraInfoLoading, ledgerLoading, myAddress])

  return (
    <div
      className={cx(
        'grid w-full grid-cols-2 gap-4',
        !myAddress ? 'md:grid-cols-2' : 'md:grid-cols-3'
      )}
    >
      {dashboardData.map((data, i) => (
        <DashboardCard
          key={data.title}
          className={cx({
            ['col-[1/-1]']:
              i === dashboardData.length - 1 && isTouchDevice() && myAddress,
          })}
          {...data}
        />
      ))}
    </div>
  )
}

type StatsCardProps = {
  title: string
  value: React.ReactNode
  desc?: React.ReactNode
  infoTitle: React.ReactNode
  className?: string
}

const DashboardCard = ({
  title,
  value,
  desc,
  infoTitle,
  className,
}: StatsCardProps) => {
  return (
    <div
      className={cx(
        'w-full',
        'flex flex-col items-center gap-2 rounded-2xl !py-4 px-4 md:px-6',
        sectionBg,
        className
      )}
    >
      <StatsCardContent
        title={title}
        desc={value}
        tooltipText={infoTitle}
        titleClassName='justify-center'
        subDesc={desc}
      />
    </div>
  )
}

export default StatsCards
