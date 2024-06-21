import { Skeleton } from '@/components/SkeletonFallback'
import { getTodaySuperLikeCountQuery } from '@/services/datahub/content-staking/query'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { formatNumber } from '@/utils/strings'

function LikeCount({ shorten }: { shorten?: boolean }) {
  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  const myAddress = useMyMainAddress()
  const { data, isLoading } = getTodaySuperLikeCountQuery.useQuery(
    myAddress ?? ''
  )

  if ((isLoading && myAddress) || !isInitializedProxy) {
    return (
      <Skeleton className='relative -top-0.5 inline-block w-12 align-middle' />
    )
  }

  return <span>{formatNumber(data?.count ?? '0', { shorten })}</span>
}

export default LikeCount
