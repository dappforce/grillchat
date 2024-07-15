import CheckImage from '@/assets/emojis/check.png'
import ForbiddenImage from '@/assets/emojis/forbidden.png'
import TimeImage from '@/assets/emojis/time.png'
import { env } from '@/env.mjs'
import { getBlockedResourcesQuery } from '@/services/datahub/moderation/query'
import { getUnapprovedMemesCountQuery } from '@/services/datahub/posts/query'
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
  const { data: count, isLoading: loadingUnapproved } =
    getUnapprovedMemesCountQuery.useQuery({
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
    loadingUnapproved || loadingBlockedInApp || loadingBlockedInContest
  const blockedCount = useMemo(() => {
    if (isLoading) return null
    const blockedInAppCount =
      blockedInApp?.blockedResources.postId?.filter((id) =>
        count?.ids.includes(id)
      ).length ?? 0
    const blockedInChatCount =
      blockedInChat?.blockedResources.postId?.filter((id) =>
        count?.ids.includes(id)
      ).length ?? 0
    return blockedInAppCount + blockedInChatCount
  }, [count, blockedInApp, blockedInChat, isLoading])

  if (isLoading || loadingBlockedInApp || loadingBlockedInContest) return null

  const approved = count?.approved ?? 0
  const unapproved = count?.unapproved ?? 0

  return (
    <div
      className={cx(
        'rounded-full bg-background-lightest px-1.5 py-0 text-sm',
        className
      )}
    >
      <div className='flex items-center gap-1'>
        <div className='flex items-center gap-1'>
          <Image src={ForbiddenImage} className='h-4 w-4' alt='' />
          <span>{blockedCount}</span>
        </div>
        <span>/</span>
        <div className='flex items-center gap-1'>
          <Image src={TimeImage} className='h-4 w-4' alt='' />
          <span>{unapproved}</span>
        </div>
        <span>/</span>
        <div className='flex items-center gap-1'>
          <Image src={CheckImage} className='h-4 w-4' alt='' />
          <span>{approved}</span>
        </div>
      </div>
    </div>
  )
}
