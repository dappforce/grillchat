import { useMyMainAddress } from '@/stores/my-account'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Tabs from '../Tabs'
import { getLeaderboardLink } from '../layouts/Sidebar'
import GlobalStats from './GlobalStats'
import MyStats from './MyStats'
import { useGetLeaderboardRole } from './utils'

const getIndexById = (tabs: any[], id: string) => {
  return tabs.findIndex((tab) => tab.id === id)
}

type LeaderboardContentProps = {
  address?: string
}

const LeaderboardContent = ({ address }: LeaderboardContentProps) => {
  const myAddress = useMyMainAddress()
  const router = useRouter()

  const role = useGetLeaderboardRole()

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

  const [selectedTab, setSelectedTabIndex] = useState(0)

  useEffect(() => {
    const defaultTab = address ? 'my-stats' : 'global-stats'

    setSelectedTabIndex(getIndexById(tabs, defaultTab))
  }, [tabs, address])

  useEffect(() => {
    if (!router.isReady) return

    if (address) {
      if (address === myAddress) {
        const index = getIndexById(tabs, 'my-stats')

        setSelectedTabIndex(index > -1 ? index : 0)
      } else {
        const index = getIndexById(tabs, 'other-users-stats')

        setSelectedTabIndex(index > -1 ? index : 0)
      }
    }
  }, [address, myAddress, router])

  const TabsComp = useCallback(() => {
    return (
      <Tabs
        className='w-full max-w-full border-b border-border-gray bg-background-light text-sm md:bg-background-light/50'
        panelClassName='mt-0 w-full max-w-full px-4 pt-5'
        asContainer
        defaultTab={0}
        tabs={tabs}
        manualTabControl={{
          selectedTab: selectedTab,
          setSelectedTab: (selectedTab, tabId) => {
            if (tabId === 'global-stats') {
              router.replace('/leaderboard', '/leaderboard', {
                shallow: false,
              })
            } else if (tabId === 'my-stats') {
              router.replace(
                '/leaderboard/[address]',
                `${getLeaderboardLink(myAddress)}?role=${role}`,
                { shallow: false }
              )
            } else if (tabId === 'grill-stats') {
              router.replace('https://grillapp.net/stats')
            }
            setSelectedTabIndex(selectedTab)
          },
        }}
      />
    )
  }, [tabs.length, selectedTab, address, myAddress])

  return <TabsComp />
}

export default LeaderboardContent
