import CheckImage from '@/assets/emojis/check.png'
import ForbiddenImage from '@/assets/emojis/forbidden.png'
import TimeImage from '@/assets/emojis/time.png'
import { env } from '@/env.mjs'
import { getBlockedResourcesQuery } from '@/services/datahub/moderation/query'
import { getUserPostedMemesForCountQuery } from '@/services/datahub/posts/query'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { useMemo } from 'react'
import { Skeleton } from '../SkeletonFallback'

export default function UnapprovedMemeCount({
  address,
  chatId,
  className,
}: {
  address: string
  chatId: string
  className?: string
}) {
  const { data, isLoading: loadingMemes } =
    getUserPostedMemesForCountQuery.useQuery({
      address,
      chatId,
    })
  const { data: blockedInApp, isLoading: loadingBlockedInApp } =
    getBlockedResourcesQuery.useQuery({ appId: env.NEXT_PUBLIC_APP_ID })
  const { data: blockedInChat, isLoading: loadingBlockedInContest } =
    getBlockedResourcesQuery.useQuery({
      postEntityId: env.NEXT_PUBLIC_CONTEST_CHAT_ID,
    })

  const isLoading =
    loadingMemes || loadingBlockedInApp || loadingBlockedInContest
  const { blocked, approved, unapproved } = useMemo(() => {
    if (isLoading) return { blocked: 0, approved: 0, unapproved: 0 }
    let blocked = 0
    let approved = 0
    let unapproved = 0
    data?.forEach((meme) => {
      if (
        blockedInApp?.blockedResources.postId.includes(meme.id) ||
        blockedInChat?.blockedResources.postId.includes(meme.id)
      ) {
        blocked++
      } else if (meme.approvedInRootPost) approved++
      else unapproved++
    })
    return { blocked, approved, unapproved }
  }, [data, blockedInApp, blockedInChat, isLoading])

  if (isLoading || loadingBlockedInApp || loadingBlockedInContest)
    return <Skeleton className={cx('my-0.5', className)} />

  return (
    <div className={cx('rounded-full text-sm text-text-muted', className)}>
      <div className='flex flex-shrink-0 items-center gap-2'>
        {(data?.length ?? 0) >= 5 && (
          <div className='mr-1 flex flex-shrink-0 items-center gap-1 rounded-full border-2 border-yellow-600 px-2 py-0.5 text-yellow-500'>
            💩 {((blocked / (approved + blocked)) * 100).toFixed(0)}%
          </div>
        )}
        <div className='flex flex-shrink-0 items-center gap-1'>
          <Image src={CheckImage} className='h-4 w-4' alt='' />
          <span>{approved}</span>
        </div>
        <div className='flex flex-shrink-0 items-center gap-1'>
          <Image src={ForbiddenImage} className='h-4 w-4' alt='' />
          <span>{blocked}</span>
        </div>
        <div className='flex flex-shrink-0 items-center gap-1'>
          <Image src={TimeImage} className='h-4 w-4' alt='' />
          <span>{unapproved}</span>
        </div>
      </div>
    </div>
  )
}
