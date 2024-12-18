import { Skeleton } from '@/components/SkeletonFallback'
import { useStickyElement } from '@/hooks/useStickyElement'
import { getTotalStakeQuery } from '@/services/datahub/content-staking/query'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useRef } from 'react'
import OverviewCard from './OverviewCard'

export default function CreatorSidebar({ className }: { className?: string }) {
  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  const ref = useRef<HTMLDivElement | null>(null)
  const myAddress = useMyMainAddress() ?? ''
  const { isLoading } = getTotalStakeQuery.useQuery(myAddress)

  if (!isInitializedProxy || (isLoading && myAddress))
    return (
      <div className={className} ref={ref}>
        <div
          className={cx(
            'flex animate-pulse flex-col rounded-2xl bg-background-light'
          )}
        >
          <div className='flex flex-col gap-1 border-b border-border-gray p-4'>
            <Skeleton className='w-48 text-lg' />
            <Skeleton className='w-32 text-sm' />
          </div>
          <div className='flex flex-col gap-3 p-4 text-sm'>
            <Skeleton className='w-full' />
            <Skeleton className='w-full' />
            <Skeleton className='w-full' />
            <Skeleton className='w-full' />
          </div>
        </div>
      </div>
    )

  return <SidebarContent className={className} />
}

function SidebarContent({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { position, top } = useStickyElement({ elRef: ref, top: 56 })
  const myAddress = useMyMainAddress() ?? ''
  const { data: totalStake } = getTotalStakeQuery.useQuery(myAddress)

  return (
    <div
      className={cx('flex flex-col gap-4', className)}
      ref={ref}
      style={{ position, top }}
    >
      <OverviewCard />
    </div>
  )
}
