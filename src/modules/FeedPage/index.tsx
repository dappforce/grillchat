import Tabs, { TabsProps } from '@/components/Tabs'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { cx } from '@/utils/class-names'
import HotPostsContent from './HotPostsContent'
import SupportCreatorsCard from './SupportCreatorsCard'

export type FeedPageProps = {
  initialPostIds: string[]
  postsCount: number
}

export default function FeedPage(props: FeedPageProps) {
  const tabs: TabsProps['tabs'] = [
    {
      id: 'hot-posts',
      text: 'Hot Posts',
      content: () => <HotPostsContent {...props} />,
    },
    {
      id: 'latest-posts',
      text: 'Latest',
      content: () => <></>,
    },
  ]

  return (
    <DefaultLayout
      withSidebar
      rightElement={<SupportCreatorsCard />}
      navbarProps={{
        containerClassName: 'max-w-screen-medium',
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
      <Tabs
        className='border-b border-border-gray bg-background-light px-0.5 text-sm md:bg-background-light/50'
        panelClassName='mt-0 px-0'
        tabClassName={cx('px-1.5 sm:px-2')}
        asContainer
        tabs={tabs}
        withHashIntegration={false}
      />
    </DefaultLayout>
  )
}
