import Button from '@/components/Button'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import useSearch from '@/hooks/useSearch'
import { getSpaceQuery } from '@/services/datahub/spaces/query'
import { useHideUnhideSpace } from '@/services/subsocial/spaces/mutation'
import { useMyMainAddress } from '@/stores/my-account'
import { SpaceData } from '@subsocial/api/types'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { IoMdAlert } from 'react-icons/io'
import ViewSpace from './ViewSpace'

type Props = {
  spaceId: string
}

const ViewSpacePage: FC<Props> = (props) => {
  const { spaceId } = props
  const myAddress = useMyMainAddress()
  const { search, setSearch, focusController } = useSearch()
  const { data: spaceData } = getSpaceQuery.useQuery(spaceId)
  const client = useQueryClient()

  const { mutateAsync } = useHideUnhideSpace({
    onSuccess: () => {
      getSpaceQuery.invalidate(client, spaceId)
    },
  })

  const isMy = spaceData?.struct.ownerId === myAddress

  const isHidden = spaceData?.struct.hidden

  console.log('isHidden', isHidden, spaceData)

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
        {isHidden && isMy && (
          <div className='m-4 flex items-center justify-between gap-2 rounded-[12px] border border-[#f3e8ac] bg-[#fffbe6] px-4 py-3'>
            <div className='flex items-center gap-2'>
              <IoMdAlert size={20} color='#faad14' />
              <span>This space is unlisted and only you can see it</span>
            </div>
            <Button
              variant='primaryOutline'
              onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()

                await mutateAsync({
                  spaceId,
                  action: 'unhide',
                })
              }}
              size='sm'
            >
              Make visible
            </Button>
          </div>
        )}
        <ViewSpace spaceData={spaceData as SpaceData} />
      </div>
    </DefaultLayout>
  )
}

export default ViewSpacePage
