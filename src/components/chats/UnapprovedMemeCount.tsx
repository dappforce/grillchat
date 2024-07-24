import CheckImage from '@/assets/emojis/check.png'
import ForbiddenImage from '@/assets/emojis/forbidden.png'
import TimeImage from '@/assets/emojis/time.png'
import { env } from '@/env.mjs'
import { getBlockedResourcesQuery } from '@/services/datahub/moderation/query'
import { getUserPostedMemesForCountQuery } from '@/services/datahub/posts/query'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { useMemo } from 'react'

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

  if (isLoading || loadingBlockedInApp || loadingBlockedInContest) return null

  return (
    <div
      className={cx(
        'rounded-full bg-background-lightest px-1.5 py-0 text-sm',
        className
      )}
    >
      <div className='flex flex-shrink-0 items-center gap-1'>
        <div className='flex flex-shrink-0 items-center gap-1'>
          <Image src={CheckImage} className='h-4 w-4' alt='' />
          <span>{approved}</span>
        </div>
        <span className='flex-shrink-0 text-text-muted'>/</span>
        <div className='flex flex-shrink-0 items-center gap-1'>
          <Image src={ForbiddenImage} className='h-4 w-4' alt='' />
          <span>{blocked}</span>
        </div>
        <span className='flex-shrink-0 text-text-muted'>/</span>
        <div className='flex flex-shrink-0 items-center gap-1'>
          <Image src={TimeImage} className='h-4 w-4' alt='' />
          <span>{unapproved}</span>
        </div>
      </div>
    </div>
  )
}
