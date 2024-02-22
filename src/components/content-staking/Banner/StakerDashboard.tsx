import PopOver from '@/components/floating/PopOver'
import SkeletonFallback from '@/components/SkeletonFallback'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getGeneralEraInfoData } from '@/services/contentStaking/generalErainfo/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import {
  convertToBalanceWithDecimal,
  isDef,
  toShortMoney,
} from '@subsocial/utils'
import BN from 'bignumber.js'
import { useMemo } from 'react'
import { BsQuestionCircle } from 'react-icons/bs'
import { getBackerLedgerQuery } from '../../../services/contentStaking/backerLedger/query'

const StatsCards = () => {
  const myAddress = useMyMainAddress()

  const { data: info, isLoading: generalEraInfoLoading } =
    getGeneralEraInfoData()
  const { data: ledger, isLoading: ledgerLoading } =
    getBackerLedgerQuery.useQuery(myAddress || '')

  const { tokenSymbol, decimal } = useGetChainDataByNetwork('subsocial') || {}

  const stakedBalanceValue = info?.staked ?? 0
  const { locked } = ledger || {}

  const myLockWithDecimals = locked
    ? convertToBalanceWithDecimal(locked, decimal || 0)
    : new BN(0)

  const myLock = (
    <>
      {myLockWithDecimals.toString()} {tokenSymbol}
    </>
  )

  const stakedBalanceWithDecimals = stakedBalanceValue
    ? convertToBalanceWithDecimal(stakedBalanceValue.toString(), decimal || 0)
    : new BN(0)

  const stakedBalance = (
    <>
      {toShortMoney({
        num: stakedBalanceWithDecimals.toNumber(),
        fractions: 2,
      })}{' '}
      {tokenSymbol}
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
      },
      {
        title: 'Total locked',
        value: (
          <SkeletonFallback isLoading={generalEraInfoLoading}>
            {stakedBalance}
          </SkeletonFallback>
        ),
        infoTitle: 'The total amount of tokens locked on the Subsocial network',
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
  infoTitle?: React.ReactNode
  className?: string
}

export const DashboardCard = ({
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
        'flex flex-col gap-2 rounded-2xl !py-4 px-4 md:px-6',
        'w-full bg-black/5 backdrop-blur-xl dark:bg-white/5',
        className
      )}
    >
      <div className='flex items-center gap-2 text-text-muted'>
        {infoTitle ? (
          <PopOver
            trigger={
              <div className='flex items-center gap-2'>
                {title}
                <BsQuestionCircle />
              </div>
            }
            panelSize='sm'
            yOffset={4}
            placement='top'
            triggerOnHover
          >
            {infoTitle}
          </PopOver>
        ) : (
          title
        )}
      </div>
      <div>
        <div className='text-[19px] font-semibold text-text md:text-2xl'>
          {value}
        </div>
        {desc && <div className='text-sm text-text-muted'>{desc}</div>}
      </div>
    </div>
  )
}

export default StatsCards
