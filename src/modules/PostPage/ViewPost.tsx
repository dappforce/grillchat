import Button from '@/components/Button'
import NoData from '@/components/NoData'
import { PostData } from '@subsocial/api/types/dto'
import { isEmptyStr } from '@subsocial/utils'
import { IoMdAdd } from 'react-icons/io'
import WritePostPreview from './EditPost/WritePostPreview'
import PostPreview from './PostPreview'

type Props = {
  postData?: PostData
  showFullAbout?: boolean
  withTags?: boolean
}

export const renderPostTitle = (post?: PostData | null) => {
  const name = post?.content?.title
  const spaceName = isEmptyStr(name) ? (
    <span className='text-text-muted'>{'Unnamed post'}</span>
  ) : (
    name
  )

  return spaceName
}

const ViewPost = ({ postData, withTags = true }: Props) => {
  if (!postData) return null

  return (
    <div className='flex flex-col gap-6 p-6'>
      <PostPreview
        spaceId={postData.id}
        withWrapper={false}
        withStats={true}
        withTags={withTags}
        showFullAbout={true}
      />
      <WritePostPreview />
      <NoData
        message={'No posts yet'}
        button={
          <Button
            variant='primary'
            href={`/post/${postData.id}/posts/new`}
            className='flex items-center gap-2'
          >
            <IoMdAdd /> Create post
          </Button>
        }
      />
    </div>
  )
}

export default ViewPost
