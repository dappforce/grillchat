import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import useSearch from '@/hooks/useSearch'
import { FC } from 'react'
import SpacesList from './SpacesList'

type Props = {
  spaceIds: string[]
}

const SpacesPage: FC<Props> = ({ spaceIds }) => {
  const { search, setSearch, focusController } = useSearch()

  console.log(spaceIds)

  console.log('spaces page')

  return (
    <DefaultLayout
      withSidebar
      withRightSidebar={false}
      navbarProps={{
        customContent: ({
          logoLink,
          authComponent,
          notificationBell,
          newPostButton,
        }) => {
          return (
            <NavbarWithSearch
              customContent={(searchButton) => (
                <div className='flex w-full items-center justify-between gap-4'>
                  {logoLink}
                  <div className='flex items-center gap-0'>
                    {newPostButton}
                    {searchButton}
                    {notificationBell}
                    <div className='ml-2.5'>{authComponent}</div>
                  </div>
                </div>
              )}
              searchProps={{
                search,
                setSearch,
                ...focusController,
              }}
            />
          )
        },
      }}
    >
      <div className='flex w-full flex-1 flex-col lg:pr-3'>
        <SpacesList spaceIds={spaceIds} />
      </div>
    </DefaultLayout>
  )
}

export default SpacesPage
