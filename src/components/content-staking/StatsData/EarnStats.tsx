import FormatBalance from '@/components/FormatBalance'
import SkeletonFallback from '@/components/SkeletonFallback'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getGeneralEraInfoData } from '@/services/contentStaking/generalErainfo/query'
import { getGeneralStatsData } from '@/services/datahub/generalStats/query'
import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BN from 'bignumber.js'
import StatsCard from './StatsCard'
import { getBalanceInDollars } from '@/utils/balance'
import { getPriceQuery } from '@/services/subsocial/prices/query'
import { sectionTitleStyles } from '../utils/commonStyles'

const EarnStats = () => {
  const { decimal, tokenSymbol } = useGetChainDataByNetwork('subsocial') || {}
  const { data: info, isLoading: generalEraInfoLoading } =
    getGeneralEraInfoData()

  const { data: price, isLoading: priceLoading } = getPriceQuery.useQuery('subsocial')

  const tokenPrice = price?.current_price

  const { data: generalStatsData, isLoading: generalStatsLoading } =
    getGeneralStatsData()

  const stakersEarnedTotal = generalStatsData?.stakersEarnedTotal

  const stakersEarnedTotalBN = stakersEarnedTotal
    ? convertToBalanceWithDecimal(stakersEarnedTotal, decimal || 0)
    : new BN(0)

  const mockedData = [
    {
      title: 'Total SUB earned by stakers',
      desc: (
        <FormatBalance
          value={stakersEarnedTotalBN.toString()}
          symbol={tokenSymbol}
          loading={generalStatsLoading}
          defaultMaximumFractionDigits={3}
        />
      ),
      subDesc: (
        <FormatBalance
          value={getBalanceInDollars(stakersEarnedTotalBN.toString(), tokenPrice)}
          symbol={'$'}
          loading={priceLoading || generalStatsLoading}
          defaultMaximumFractionDigits={2}
          startFromSymbol
        />
      ),
      tooltipText: 'Since Content Staking was released',
    },
    {
      title: 'Total participants',
      desc: (
        <SkeletonFallback isLoading={generalEraInfoLoading}>
          {info?.backerCount}
        </SkeletonFallback>
      ),
    },
  ]

  return (
    <div className='flex flex-col gap-4'>
      <div className={sectionTitleStyles}>
        How much others earn
      </div>

      <div className='grid md:grid-cols-2 grid-cols-1 items-stretch gap-4'>
        {mockedData.map((props, i) => (
          <StatsCard sectionClassName='bg-white' key={i} {...props} />
        ))}
      </div>
    </div>
  )
}

export default EarnStats
