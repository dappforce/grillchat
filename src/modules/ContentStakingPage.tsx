import ContentStaking from '@/components/content-staking'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import Navbar from '@/components/navbar/Navbar'

const ContentStakingPage = () => {
  return (
    <DefaultLayout
      navbarProps={{
        containerClassName: 'max-w-screen-medium',
        customContent: ({ logoLink, authComponent, notificationBell }) => {
          return (
            <Navbar
              className='w-full'
              containerClassName='max-w-screen-medium'
              customContent={() => (
                <div className='flex w-full items-center justify-between gap-4'>
                  {logoLink}
                  <div className='flex items-center gap-1'>
                    {notificationBell}
                    <div className='ml-2'>{authComponent}</div>
                  </div>
                </div>
              )}
            />
          )
        },
      }}
    >
      <div className='flex flex-col overflow-hidden md:px-0 px-4'>
        <div className='relative mx-auto mt-4 mb-[131px] w-full max-w-screen-medium px-0'>
          <ContentStaking />
        </div>
      </div>
    </DefaultLayout>
  )
}

export default ContentStakingPage
