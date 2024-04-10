import { getPostQuery } from '@/services/api/query'
import PostInfoPreview from './utils/CreatorInfo'

type PostPreviewProps = {
  postId: string
}

const PostPreview = ({ postId }: PostPreviewProps) => {
  const { data: post } = getPostQuery.useQuery(postId)

  if (!post) return null

  const { struct } = post

  const { spaceId } = struct

  if (!spaceId) return null

  return (
    <div className='p-4 pt-2'>
      <PostInfoPreview post={post} />
    </div>
  )
}

export default PostPreview
