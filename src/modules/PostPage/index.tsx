import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import useSearch from '@/hooks/useSearch'
import { getPostQuery } from '@/services/api/query'
import { useMyMainAddress } from '@/stores/my-account'
import { FC } from 'react'
import ViewPost from './ViewPost'

type Props = {
  postId: string
}

const ViewPostPage: FC<Props> = (props) => {
  const { postId } = props
  const myAddress = useMyMainAddress()
  const { search, setSearch, focusController } = useSearch()
  const { data: postData } = getPostQuery.useQuery(postId)

  console.log('hello', postData)

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
        <ViewPost postData={postData as any} />
      </div>
    </DefaultLayout>
  )
}

export default ViewPostPage
