import LinkText from '@/components/LinkText'
import SkeletonFallback from '@/components/SkeletonFallback'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getGeneralEraInfoData } from '@/services/contentStaking/generalErainfo/query'
import { getGeneralStatsData } from '@/services/datahub/generalStats/query'
import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BN from 'bignumber.js'
import StatsCard from './StatsCard'

const EarnStats = () => {
  const { decimal, tokenSymbol } = useGetChainDataByNetwork('subsocial') || {}
  const { data: info, isLoading: generalEraInfoLoading } =
    getGeneralEraInfoData()

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
        <SkeletonFallback isLoading={generalStatsLoading}>
          {stakersEarnedTotalBN.toFormat(2)} {tokenSymbol}
        </SkeletonFallback>
      ),
      subDesc: '$15,656.34',
      tooltipText: 'blablabla',
    },
    {
      title: 'Total participants',
      desc: (
        <SkeletonFallback isLoading={generalEraInfoLoading}>
          {info?.backerCount}
        </SkeletonFallback>
      ),
      tooltipText: 'blablabla',
    },
  ]

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className='text-2xl font-bold leading-none'>
          How much others earn
        </div>
        <LinkText variant='primary' className='no-underline'>
          How much can I earn ?
        </LinkText>
      </div>
      <div className='grid grid-cols-2 items-stretch gap-4'>
        {mockedData.map((props, i) => (
          <StatsCard key={i} {...props} />
        ))}
      </div>
    </div>
  )
}

export default EarnStats
