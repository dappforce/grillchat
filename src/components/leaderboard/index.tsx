import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import Tabs from '../Tabs'
import GlobalStats from './GlobalStats'
import { LeaderboardContextWrapper } from './LeaderboardContext'
import MyStats from './MyStats'

const LeaderboardContent = () => {
  const myAddress = useMyMainAddress()

  const tabs = [
    {
      id: 'my-stats',
      text: 'My Staking Stats',
      content: () => <MyStats address={myAddress || ''} />,
    },
    {
      id: 'global-stats',
      text: 'Global Staking Stats',
      content: () => <GlobalStats />,
    },
  ]

  return (
    <>
      <LeaderboardContextWrapper>
        <Tabs
          className='w-full max-w-full border-b border-border-gray bg-background-light text-sm md:bg-background-light/50'
          panelClassName='mt-0 w-full max-w-full px-4 pt-5'
          tabClassName={cx('')}
          asContainer
          tabs={tabs}
          withHashIntegration={false}
          hideBeforeHashLoaded
        />
      </LeaderboardContextWrapper>
    </>
  )
}

export default LeaderboardContent
