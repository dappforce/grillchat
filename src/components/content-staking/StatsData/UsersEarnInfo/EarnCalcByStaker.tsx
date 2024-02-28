import FormatBalance from '@/components/FormatBalance'
import RangeInput from '@/components/inputs/RangeInput'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getGeneralEraInfoData } from '@/services/contentStaking/generalErainfo/query'
import { getPriceQuery } from '@/services/subsocial/prices/query'
import { getBalanceInDollars } from '@/utils/balance'
import { cx } from '@/utils/class-names'
import { convertToBalanceWithDecimal, toShortMoney } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useMemo, useState } from 'react'
import StatsCard from '../StatsCard'

const minRangeValue = 2000
const maxRangeValue = 1000000

const EarnCalcSection = () => {
  const [rangeValue, setRangeValue] = useState(50000)
  const { tokenSymbol, decimal } = useGetChainDataByNetwork('subsocial') || {}
  const { data, isLoading } = getGeneralEraInfoData()
  const { data: price, isLoading: priceLoading } =
    getPriceQuery.useQuery('subsocial')

  const tokenPrice = price?.current_price

  const { locked } = data || {}

  const { min, max } = useMemo(() => {
    if (!locked || !tokenPrice)
      return { min: new BN(0), max: new BN(0), subAmount: new BN(0) }

    const lockedWithDecimal = convertToBalanceWithDecimal(locked, decimal || 0)

    const min = new BN(5.75)
      .multipliedBy(new BN(7200))
      .multipliedBy(new BN(7))
      .dividedBy(lockedWithDecimal)
      .multipliedBy(rangeValue)

    const max = min.multipliedBy(new BN(3))

    return { min, max }
  }, [rangeValue, locked, tokenPrice])

  return (
    <>
      <div className='p-4'>
        <div className='mb-16 text-xl text-text'>Staked amount:</div>
        <RangeInput
          value={rangeValue}
          rerenderTrigger={[ priceLoading ]}
          setValue={setRangeValue}
          min={minRangeValue}
          max={maxRangeValue}
          valueLabel={
            <div className={cx('flex flex-col gap-2 text-center font-medium')}>
              <span className='text-base leading-none text-white'>
                {
                  <FormatBalance
                    value={getBalanceInDollars(
                      rangeValue.toString(),
                      tokenPrice
                    )}
                    symbol={'$'}
                    loading={priceLoading}
                    defaultMaximumFractionDigits={0}
                    startFromSymbol
                  />
                }
              </span>
              <span className='text-sm leading-none text-white/80'>
                {toShortMoney({ num: rangeValue })} {tokenSymbol}
              </span>
            </div>
          }
          rangeLabels={{
            minLabel: (
              <RangeLabel
                label={
                  <FormatBalance
                    value={getBalanceInDollars(
                      minRangeValue.toString(),
                      tokenPrice
                    )}
                    symbol={'$'}
                    loading={priceLoading}
                    defaultMaximumFractionDigits={0}
                    startFromSymbol
                  />
                }
                desc={
                  <>
                    {toShortMoney({ num: minRangeValue })} {tokenSymbol}
                  </>
                }
              />
            ),
            middleLabel: (
              <RangeLabel
                label={
                  <FormatBalance
                    value={getBalanceInDollars(
                      (maxRangeValue / 2).toString(),
                      tokenPrice
                    )}
                    symbol={'$'}
                    loading={priceLoading}
                    defaultMaximumFractionDigits={0}
                    startFromSymbol
                  />
                }
                desc={
                  <>
                    {toShortMoney({ num: maxRangeValue / 2 })} {tokenSymbol}
                  </>
                }
                className='absolute left-1/2 -translate-x-1/2 transform text-center'
              />
            ),
            maxLabel: (
              <RangeLabel
                label={
                  <FormatBalance
                    value={getBalanceInDollars(
                      maxRangeValue.toString(),
                      tokenPrice
                    )}
                    symbol={'$'}
                    loading={priceLoading}
                    defaultMaximumFractionDigits={0}
                    startFromSymbol
                  />
                }
                desc={
                  <>
                    {toShortMoney({ num: maxRangeValue })} {tokenSymbol}
                  </>
                }
                className='text-end'
              />
            ),
          }}
        />
        <div className='mt-4 flex md:flex-row flex-col w-full items-stretch gap-4'>
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
                value={getBalanceInDollars(min.toString(), tokenPrice)}
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
                value={getBalanceInDollars(max.toString(), tokenPrice)}
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

type RangeLabelProps = {
  label: React.ReactNode
  desc: React.ReactNode
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

export default EarnCalcSection
