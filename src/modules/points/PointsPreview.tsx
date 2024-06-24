import { Skeleton } from '@/components/SkeletonFallback'
import { getBalanceQuery } from '@/services/datahub/leaderboard/points-balance/query'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { formatNumber } from '@/utils/strings'
import { useMemo } from 'react'
import SlotCounter from 'react-slot-counter'

function Points({
  shorten,
  withPointsAnimation = true,
}: {
  shorten?: boolean
  withPointsAnimation?: boolean
}) {
  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  const myAddress = useMyMainAddress()
  const { data, isLoading } = getBalanceQuery.useQuery(myAddress || '')

  const formatted = formatNumber(data ?? '0', { shorten })
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
