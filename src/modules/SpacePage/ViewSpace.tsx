import Button from '@/components/Button'
import NoData from '@/components/NoData'
import { getPostsBySpaceIdQuery } from '@/services/datahub/posts/query'
import { SpaceData } from '@subsocial/api/types'
import { isEmptyStr } from '@subsocial/utils'
import { IoMdAdd } from 'react-icons/io'
import WritePostPreview from '../PostPage/EditPost/WritePostPreview'
import PostPreview from '../PostPage/PostPreview'
import SpacePreview from './SpacePreview'

type Props = {
  spaceData?: SpaceData
  showFullAbout?: boolean
  withTags?: boolean
}

export const renderSpaceName = (space: SpaceData) => {
  const name = space?.content?.name
  const spaceName = isEmptyStr(name) ? (
    <span className='text-text-muted'>{'Unnamed Space'}</span>
  ) : (
    name
  )

  return spaceName
}

const ViewSpace = ({ spaceData, withTags = true }: Props) => {
  if (!spaceData) return null

  const { data: posts } = getPostsBySpaceIdQuery.useQuery(spaceData.id)

  console.log(posts)

  const postsCount = posts?.length

  console.log()

  return (
    <div className='flex flex-col gap-6 p-6'>
      <SpacePreview
        spaceId={spaceData.id}
        withWrapper={false}
        withStats={true}
        withTags={withTags}
        showFullAbout={true}
      />
      <WritePostPreview />
      {!postsCount ? (
        <NoData
          message={'No posts yet'}
          button={
            <Button
              variant='primary'
              href={`/space/${spaceData.id}/posts/new`}
              className='flex items-center gap-2'
            >
              <IoMdAdd /> Create post
            </Button>
          }
        />
      ) : (
        <div className='flex flex-col gap-6'>
          {posts?.map((post) => (
            <div key={post.id}>
              <PostPreview postId={post.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewSpace
