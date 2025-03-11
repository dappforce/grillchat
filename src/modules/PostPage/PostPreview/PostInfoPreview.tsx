import AddressAvatar from '@/components/AddressAvatar'
import SpaceAvatar from '@/components/SpaceAvatar'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { getSpaceQuery } from '@/services/datahub/spaces/query'
import { PostData } from '@subsocial/api/types'

type PostInfoPreviewProps = {
  post: PostData
}

const PostInfoPreview = ({ post }: PostInfoPreviewProps) => {
  const { struct, content } = post

  if (!struct || !content) return null

  const { createdByAccount, spaceId } = struct
  const { data: profile } = getProfileQuery.useQuery(createdByAccount || '')

  const { data: space } = getSpaceQuery.useQuery(spaceId || '')

  const profileSpaceId = profile?.profileSpace?.id

  const isProfileSpace = post.id === profileSpaceId

  if (!space) return null

  const { struct: spaceStruct, content: spaceContent } = space

  const { name: spaceName } = spaceContent || {}

  return (
    <div className='flex justify-between gap-2'>
      <div className='flex gap-2'>
        {isProfileSpace ? (
          <AddressAvatar address={createdByAccount} />
        ) : (
          <div className='flex items-center'>
            <SpaceAvatar space={space} />{' '}
            <AddressAvatar address={createdByAccount} className='ml-[-20px]' />
          </div>
        )}
      </div>
    </div>
  )
}

export default PostInfoPreview
