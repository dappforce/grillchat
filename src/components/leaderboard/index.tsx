import { useMyMainAddress } from '@/stores/my-account'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Tabs from '../Tabs'
import GlobalStats from './GlobalStats'
import { LeaderboardContextWrapper } from './LeaderboardContext'
import MyStats from './MyStats'

type LeaderboardContentProps = {
  address?: string
}

const LeaderboardContent = ({ address }: LeaderboardContentProps) => {
  const myAddress = useMyMainAddress()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs = useMemo(() => {
    const values = [
      {
        id: 'global-stats',
        text: 'Global Staking Stats',
        content: () => <GlobalStats />,
      },
      {
        id: 'grill-stats',
        text: 'Grill Stats',
        content: () => <></>,
      },
      {
        id: 'other-users-stats',
        text: 'Other user stats',
        content: () => <MyStats address={address || ''} />,
        isHidden: true,
      },
    ]

    if (myAddress) {
      return [
        {
          id: 'my-stats',
          text: 'My Staking Stats',
          content: () => <MyStats address={address || myAddress || ''} />,
        },
        ...values,
      ]
    }

    return values
  }, [address, myAddress])

  useEffect(() => {
    if (myAddress !== address && address && myAddress) {
      setSelectedTab(tabs.length - 1)
    } else if (myAddress === address) {
      setSelectedTab(0)
    }
  }, [address, tabs.length, myAddress])

  return (
    <>
      <LeaderboardContextWrapper>
        <Tabs
          className='w-full max-w-full border-b border-border-gray bg-background-light text-sm md:bg-background-light/50'
          panelClassName='mt-0 w-full max-w-full px-4 pt-5'
          defaultTab={router.query.address ? 0 : 1}
          asContainer
          tabs={tabs}
          withHashIntegration={false}
          hideBeforeHashLoaded
          manualTabControl={{
            selectedTab: selectedTab,
            setSelectedTab: (selectedTab, tabId) => {
              setSelectedTab(selectedTab)

              if (tabId === 'global-stats') {
                router.replace('/leaderboard', '/leaderboard', {})
              } else if (tabId === 'my-stats') {
                router.replace(
                  '/leaderboard/[address]',
                  `/leaderboard/${myAddress}`
                )
              } else if (tabId === 'grill-stats') {
                router.push('https://grillapp.net/stats')
              }
            },
          }}
        />
      </LeaderboardContextWrapper>
    </>
  )
}

export default LeaderboardContent
