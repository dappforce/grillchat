import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import useSearch from '@/hooks/useSearch'
import { getSpaceQuery } from '@/services/datahub/spaces/query'
import { SpaceData } from '@subsocial/api/types'
import { FC } from 'react'
import ViewSpace from './ViewSpace'

type Props = {
  spaceId: string
}

const ViewSpacePage: FC<Props> = (props) => {
  const { spaceId } = props
  const { search, setSearch, focusController } = useSearch()
  const { data: spaceData } = getSpaceQuery.useQuery(spaceId)

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
        <ViewSpace spaceData={spaceData as SpaceData} />
      </div>
    </DefaultLayout>
  )
}

export default ViewSpacePage
