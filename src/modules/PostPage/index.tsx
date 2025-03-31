import Button from '@/components/Button'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import useSearch from '@/hooks/useSearch'
import { getPostQuery } from '@/services/api/query'
import { useHideUnhidePost } from '@/services/subsocial/posts/mutation'
import { useMyMainAddress } from '@/stores/my-account'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { IoMdAlert } from 'react-icons/io'
import ViewPost from './ViewPost'

type Props = {
  postId: string
}

const ViewPostPage: FC<Props> = (props) => {
  const myAddress = useMyMainAddress()
  const { postId } = props
  const { search, setSearch, focusController } = useSearch()
  const client = useQueryClient()
  const { data: postData } = getPostQuery.useQuery(postId, {
    showHiddenPost: {
      type: 'owner',
      owner: myAddress || '',
    },
  })

  const { mutateAsync } = useHideUnhidePost({
    onSuccess: () => {
      getPostQuery.fetchQuery(client, postId)
    },
  })

  const isMy = postData?.struct.ownerId === myAddress

  const { struct } = postData || {}

  const isHidden = struct?.hidden

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
              <span>This post is unlisted and only you can see it</span>
            </div>
            <Button
              variant='primaryOutline'
              onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()

                await mutateAsync({
                  postId,
                  action: 'unhide',
                })
              }}
              size='sm'
            >
              Make visible
            </Button>
          </div>
        )}
        <ViewPost postData={postData as any} />
      </div>
    </DefaultLayout>
  )
}

export default ViewPostPage
