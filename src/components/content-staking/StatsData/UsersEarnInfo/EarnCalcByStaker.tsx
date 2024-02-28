import FormatBalance from '@/components/FormatBalance'
import RangeInput from '@/components/inputs/RangeInput'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getGeneralEraInfoData } from '@/services/contentStaking/generalErainfo/query'
import { getPriceQuery } from '@/services/subsocial/prices/query'
import { cx } from '@/utils/class-names'
import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useMemo, useState } from 'react'
import StatsCard from '../StatsCard'
import { getBalanceInDollars } from '@/utils/balance'
const mockedData = [
  {
    title: 'Total SUB earned by stakers',
    desc: '1,123,434 SUB',
    subDesc: '$15,656.34',
    tooltipText: 'blablabla',
  },
  {
    title: 'Total participants',
    desc: '217',
    tooltipText: 'blablabla',
  },
]

type RangeLabelProps = {
  label: string
  desc: string
  className?: string
}

const RangeLabel = ({ label, desc, className }: RangeLabelProps) => {
  return (
    <div className={cx('flex flex-col font-medium', className)}>
      <span className='text-lg leading-[26px] text-text'>{label}</span>
      <span className='text-base leading-[26px] text-text-muted'>{desc}</span>
    </div>
  )
}

const EarnCalcSection = () => {
  const [rangeValue, setRangeValue] = useState(1000)
  const { tokenSymbol, decimal } = useGetChainDataByNetwork('subsocial') || {}
  const { data, isLoading } = getGeneralEraInfoData()
  const { data: price, isLoading: priceLoading } =
    getPriceQuery.useQuery('subsocial')

  const tokenPrice = price?.current_price

  const { locked } = data || {}

  const { min, max, subAmount } = useMemo(() => {
    if (!locked || !tokenPrice)
      return { min: new BN(0), max: new BN(0), subAmount: new BN(0) }

    const subAmount = new BN(rangeValue).dividedBy(new BN(tokenPrice))

    const lockedWithDecimal = convertToBalanceWithDecimal(locked, decimal || 0)

    const min = new BN(5.75)
      .multipliedBy(new BN(7200))
      .multipliedBy(new BN(7))
      .dividedBy(lockedWithDecimal)
      .multipliedBy(subAmount)

    const max = min.multipliedBy(new BN(3))

    return { min, max, subAmount }
  }, [rangeValue, locked, tokenPrice])

  return (
    <>
      <div className='p-4'>
        <div className='mb-16 text-xl text-text'>
          How much would you like to stake?
        </div>
        <RangeInput
          value={rangeValue}
          setValue={setRangeValue}
          min={20}
          max={10000}
          valueLabel={
            <div className={cx('flex flex-col gap-2 text-center font-medium')}>
              <span className='text-base leading-none text-white'>
                ${rangeValue.toString()}
              </span>
              <span className='text-sm leading-none text-white/80'>
                {subAmount?.toFixed(2)} {tokenSymbol}
              </span>
            </div>
          }
          rangeLabels={{
            minLabel: <RangeLabel label={'$20'} desc='2000 SUB' />,
            middleLabel: (
              <RangeLabel
                label={'$5000'}
                desc='100,000 SUB'
                className='absolute left-1/2 -translate-x-1/2 transform text-center'
              />
            ),
            maxLabel: (
              <RangeLabel
                label={'$10,000'}
                desc='1,000,000 SUB'
                className='text-end'
              />
            ),
          }}
        />
        <div className='mt-4 flex w-full items-stretch gap-4'>
          <StatsCard
            title='Your minimum rewards:'
            desc={
              <FormatBalance
                value={min.toString()}
                symbol={`${tokenSymbol} / week`}
                loading={isLoading || priceLoading}
                defaultMaximumFractionDigits={3}
              />
            }
            tooltipText={'blablabla'}
            titleClassName='justify-center'
            subDesc={
              <FormatBalance
                value={getBalanceInDollars(
                  min.toString(),
                  tokenPrice
                )}
                symbol={'$'}
                loading={isLoading || priceLoading}
                defaultMaximumFractionDigits={2}
                startFromSymbol
              />
            }
          />
          <StatsCard
            title='Your maximum rewards:'
            desc={
              <FormatBalance
                value={max.toString()}
                symbol={`${tokenSymbol} / week`}
                loading={isLoading || priceLoading}
                defaultMaximumFractionDigits={3}
              />
            }
            tooltipText={'blablabla'}
            titleClassName='justify-center'
            subDesc={
              <FormatBalance
                value={getBalanceInDollars(
                  max.toString(),
                  tokenPrice
                )}
                symbol={'$'}
                loading={isLoading || priceLoading}
                defaultMaximumFractionDigits={2}
                startFromSymbol
              />
            }
          />
        </div>
      </div>
    </>
  )
}

export default EarnCalcSection
