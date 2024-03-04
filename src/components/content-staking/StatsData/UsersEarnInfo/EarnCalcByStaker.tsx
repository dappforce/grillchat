import Button from '@/components/Button'
import FormatBalance from '@/components/FormatBalance'
import LinkText from '@/components/LinkText'
import RangeInput from '@/components/inputs/RangeInput'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getGeneralEraInfoData } from '@/services/contentStaking/generalErainfo/query'
import { getPriceQuery } from '@/services/subsocial/prices/query'
import { useSendEvent } from '@/stores/analytics'
import { getBalanceInDollars } from '@/utils/balance'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { convertToBalanceWithDecimal, toShortMoney } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useMemo, useState } from 'react'
import StakingModal from '../../modals/StakeModal'
import { ACTIVE_STAKING_SPACE_ID } from '../../utils'
import { useContentStakingContext } from '../../utils/ContentStakingContext'
import StatsCard from '../StatsCard'

const minRangeValue = 2000
const maxRangeValue = 1000000

const EarnCalcSection = () => {
  const sendEvent = useSendEvent()
  const [openStakeModal, setOpenStakeModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [rangeValue, setRangeValue] = useState(50000)
  const { tokenSymbol, decimal } = useGetChainDataByNetwork('subsocial') || {}
  const { data, isLoading } = getGeneralEraInfoData()
  const { isLockedTokens } = useContentStakingContext()
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
      <div className='flex flex-col p-4'>
        <div className='mb-16 text-lg text-text md:text-xl'>Staked amount:</div>
        <RangeInput
          value={rangeValue}
          rerenderTrigger={[priceLoading]}
          setValue={setRangeValue}
          min={minRangeValue}
          max={maxRangeValue}
          onMouseUp={() => sendEvent('cs_slider_moved', { value: rangeValue })}
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
        <div className='mt-4 flex w-full flex-col items-stretch gap-4 md:flex-row'>
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
            tooltipText={
              <>
                The amount of SUB you will receive if you only like 1 post per
                week, and there is no{' '}
                <LinkText
                  href={
                    'https://docs.subsocial.network/docs/basics/content-staking/content-staking/'
                  }
                  target='_blank'
                  variant={'primary'}
                >
                  multiplier
                </LinkText>
                .
              </>
            }
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
            tooltipText={
              <>
                The amount of SUB you will receive if you like 10 post per day
                for the entire week, and there is a{' '}
                <LinkText
                  href={
                    'https://docs.subsocial.network/docs/basics/content-staking/content-staking/'
                  }
                  target='_blank'
                  variant={'primary'}
                >
                  4x multiplier
                </LinkText>
              </>
            }
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
        <Button
          variant={isLockedTokens ? 'primaryOutline' : 'primary'}
          onClick={() => {
            setOpenStakeModal(true)
            sendEvent('cs_start_earning_clicked')
          }}
          size={isTouchDevice() ? 'md' : 'lg'}
          className={cx('mt-4 w-fit self-center', {
            ['border-text-primary text-text-primary']: isLockedTokens,
          })}
        >
          {isLockedTokens ? 'Lock more SUB' : 'Start earning'}
        </Button>
      </div>
      <StakingModal
        open={openStakeModal}
        closeModal={() => setOpenStakeModal(false)}
        spaceId={ACTIVE_STAKING_SPACE_ID}
        modalVariant={isLockedTokens ? 'increaseStake' : 'stake'}
        amount={amount}
        setAmount={setAmount}
      />
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
      <span className='text-base leading-[26px] text-text md:text-lg'>
        {label}
      </span>
      <span className='text-sm leading-[26px] text-text-muted md:text-base'>
        {desc}
      </span>
    </div>
  )
}

export default EarnCalcSection
