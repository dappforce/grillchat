import Button from '@/components/Button'
import { Skeleton } from '@/components/SkeletonFallback'
import { env } from '@/env.mjs'
import useIsModerationAdmin from '@/hooks/useIsModerationAdmin'
import { getServerTimeQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import dayjs from 'dayjs'
import { ReactNode } from 'react'

export const tabStates = [
  'all',
  'contest',
  'not-approved',
  'not-approved-contest',
] as const

export type TabState = (typeof tabStates)[number]
export function TabButton({
  selectedTab,
  setSelectedTab,
  tab,
  children,
  className,
  size = 'md',
}: {
  tab: TabState
  selectedTab: TabState
  setSelectedTab: (tab: TabState) => void
  children: ReactNode
  className?: string
  size?: 'md' | 'sm'
}) {
  const isSelected = selectedTab === tab
  return (
    <Button
      variant={isSelected ? 'primary' : 'transparent'}
      className={cx(
        'h-10 py-0 text-sm',
        size === 'sm' ? 'px-2' : 'h-10',
        isSelected ? 'bg-background-primary/30' : '',
        className
      )}
      onClick={() => setSelectedTab(tab)}
    >
      {children}
    </Button>
  )
}

export function Tabs({
  setSelectedTab,
  selectedTab,
}: {
  selectedTab: TabState
  setSelectedTab: (tab: TabState) => void
}) {
  const isAdmin = useIsModerationAdmin()
  const { data: serverTime, isLoading } = getServerTimeQuery.useQuery(null)
  const daysLeft = dayjs(env.NEXT_PUBLIC_CONTEST_END_TIME).diff(
    dayjs(serverTime ?? undefined),
    'days'
  )

  const tabSize: 'sm' | 'md' = isAdmin ? 'sm' : 'md'

  return (
    <div className='sticky top-14 grid h-12 grid-flow-col items-center gap-1 bg-background px-4'>
      {isAdmin && (
        <>
          <TabButton
            tab='not-approved'
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            size={tabSize}
          >
            Pending
          </TabButton>
          <TabButton
            tab='not-approved-contest'
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            size={tabSize}
          >
            Pending Contest
          </TabButton>
        </>
      )}
      <TabButton
        tab='all'
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        size={tabSize}
      >
        {isAdmin ? 'Approved' : 'All memes'}
      </TabButton>
      <TabButton
        className='flex flex-col items-center justify-center text-center'
        tab='contest'
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        size={tabSize}
      >
        {!isAdmin ? (
          <>
            <span>{env.NEXT_PUBLIC_CONTEST_NAME}</span>
            <span className='text-xs font-medium text-text-primary'>
              {(() => {
                if (isLoading || !serverTime)
                  return <Skeleton className='w-16' />
                if (env.NEXT_PUBLIC_CONTEST_END_TIME < serverTime)
                  return <span className='text-text-red'>Contest ended</span>
                if (daysLeft === 0) {
                  const hoursLeft = dayjs(
                    env.NEXT_PUBLIC_CONTEST_END_TIME
                  ).diff(dayjs(serverTime ?? undefined), 'hours')
                  if (hoursLeft < 1) {
                    return <span>Less than an hour left</span>
                  }
                  return <span>{hoursLeft} hours left</span>
                }
                return (
                  <span>
                    {daysLeft} day{daysLeft > 1 ? 's' : ''} left
                  </span>
                )
              })()}
            </span>
          </>
        ) : (
          <span>Contest</span>
        )}
      </TabButton>
    </div>
  )
}
