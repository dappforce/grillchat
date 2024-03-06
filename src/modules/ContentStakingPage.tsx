import ContentStaking from '@/components/content-staking'
import DefaultLayout from '@/components/layouts/DefaultLayout'

const ContentStakingPage = () => {
  return (
    <DefaultLayout
      withSidebar
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
      <div className='flex flex-col overflow-hidden px-4 md:px-0'>
        <div className='relative mx-auto mb-[50px] mt-5 w-full max-w-screen-medium px-0'>
          <ContentStaking />
        </div>
      </div>
    </DefaultLayout>
  )
}

export default ContentStakingPage
