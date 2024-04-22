import DefaultLayout from '@/components/layouts/DefaultLayout'
import LeaderboardContent from '@/components/leaderboard'

const LeaderboardPage = () => {
  return (
    <DefaultLayout
      withSidebar
      withRightSidebar={false}
      navbarProps={{
        customContent: ({ logoLink, authComponent, notificationBell }) => {
          return (
            <div className='flex w-full items-center justify-between gap-4'>
              {logoLink}
              <div className='flex items-center gap-1'>
                {notificationBell}
                <div className='ml-2'>{authComponent}</div>
              </div>
            </div>
          )
        },
      }}
    >
      <div className='relative w-full'>
        <LeaderboardContent />
      </div>
    </DefaultLayout>
  )
}

export default LeaderboardPage
