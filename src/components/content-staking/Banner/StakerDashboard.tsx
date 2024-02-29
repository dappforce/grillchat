import FormatBalance from '@/components/FormatBalance'
import SkeletonFallback from '@/components/SkeletonFallback'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getGeneralEraInfoData } from '@/services/contentStaking/generalErainfo/query'
import { getGeneralStatsData } from '@/services/datahub/generalStats/query'
import { getPriceQuery } from '@/services/subsocial/prices/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { convertToBalanceWithDecimal, isDef } from '@subsocial/utils'
import BN from 'bignumber.js'
import { getBackerLedgerQuery } from '../../../services/contentStaking/backerLedger/query'
import { getBalanceInDollars } from '../../../utils/formatBalance'
import { StatsCardContent } from '../StatsData/StatsCard'

const StatsCards = () => {
  const myAddress = useMyMainAddress()
  const { tokenSymbol, decimal } = useGetChainDataByNetwork('subsocial') || {}
  const { data: price, isLoading: priceLoading } =
    getPriceQuery.useQuery('subsocial')

  const tokenPrice = price?.current_price

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

  const dashboardData = [
    {
      title: 'My lock',
      value: (
        <FormatBalance
          value={myLockWithDecimals.toString()}
          symbol={tokenSymbol}
          loading={ledgerLoading}
          defaultMaximumFractionDigits={3}
        />
      ),
      infoTitle: 'How many tokens you have locked',
      desc: (
        <FormatBalance
          value={getBalanceInDollars(myLockWithDecimals.toString(), tokenPrice)}
          symbol={'$'}
          loading={priceLoading || ledgerLoading}
          defaultMaximumFractionDigits={2}
          startFromSymbol
        />
      ),
    },
    {
      title: 'Total SUB earned by stakers',
      value: (
        <FormatBalance
          value={stakersEarnedTotalBN.toString()}
          symbol={tokenSymbol}
          loading={generalStatsLoading}
          defaultMaximumFractionDigits={3}
        />
      ),
      infoTitle: 'Since Content Staking was released',
      desc: (
        <FormatBalance
          value={getBalanceInDollars(
            stakersEarnedTotalBN.toString(),
            tokenPrice
          )}
          symbol={'$'}
          loading={priceLoading || generalStatsLoading}
          defaultMaximumFractionDigits={2}
          startFromSymbol
        />
      ),
    },
    {
      title: 'Total participants',
      value: (
        <SkeletonFallback isLoading={generalEraInfoLoading}>
          {info?.backerCount}
        </SkeletonFallback>
      ),
    },
  ]

  return (
    <div
      className={cx(
        'grid w-full grid-cols-1 gap-4',
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
  infoTitle?: React.ReactNode
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
        'bg-slate-50 backdrop-blur-xl dark:bg-white/5',
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
