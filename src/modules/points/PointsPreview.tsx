import { Skeleton } from '@/components/SkeletonFallback'
import { getBalanceQuery } from '@/services/datahub/leaderboard/points-balance/query'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { formatNumber } from '@/utils/strings'
import { useMemo } from 'react'
import SlotCounter from 'react-slot-counter'

function Points({
  shorten,
  shortWhenValueTooBig,
  withPointsAnimation = true,
}: {
  shorten?: boolean
  shortWhenValueTooBig?: boolean
  withPointsAnimation?: boolean
}) {
  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  const myAddress = useMyMainAddress()
  const { data, isLoading } = getBalanceQuery.useQuery(myAddress || '')

  const value = data ?? 0

  const shortenValue = shortWhenValueTooBig && value > 99999 ? true : shorten

  const formatted = formatNumber(value, { shorten: shortenValue })
  const splitValues = useMemo(() => {
    return formatted.split('')
  }, [formatted])

  if ((isLoading && myAddress) || !isInitializedProxy) {
    return <Skeleton className='inline-block w-12' />
  }

  if (!withPointsAnimation) return <span>{splitValues}</span>

  return (
    <SlotCounter
      containerClassName='relative -top-0.5'
      value={splitValues}
      animateOnVisible={false}
      sequentialAnimationMode
      startValue={splitValues}
      startValueOnce
    />
  )
}

export default Points
