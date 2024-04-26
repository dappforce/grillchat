import DefaultLayout from '@/components/layouts/DefaultLayout'
import LeaderboardContent from '@/components/leaderboard'

type LeaderboardPageProps = {
  address?: string
}

const LeaderboardPage = ({ address }: LeaderboardPageProps) => {
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
      <div className='relative mb-4 w-full'>
        <LeaderboardContent address={address} />
      </div>
    </DefaultLayout>
  )
}

export default LeaderboardPage
