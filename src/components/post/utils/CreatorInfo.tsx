import { getProfileQuery } from '@/services/api/query'
import { SubsocialProfile } from '@/services/subsocial/profiles/fetcher'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { getTimeRelativeToNow } from '@/utils/date'
import { PostData, SpaceData } from '@subsocial/api/types'
import { SpaceLink } from '.'
import AddressAvatar from '../../AddressAvatar'
import Name from '../../Name'
import PostContent from './PostContent'
import PostDropdownMenu from './PostDropdownMenu'

type PostInfoPreviewProps = {
  post: PostData
}

const PostInfoPreview = ({ post }: PostInfoPreviewProps) => {
  const { struct } = post
  const { spaceId } = struct

  const { data: space } = getSpaceQuery.useQuery(spaceId || '')

  return (
    <div>
      <CreatorInfo post={post} />
      <PostContent post={post} space={space?.struct} />
    </div>
  )
}

const CreatorInfo = ({ post }: PostInfoPreviewProps) => {
  const { struct } = post

  const { ownerId, spaceId, createdAtTime } = struct

  const { data: space } = getSpaceQuery.useQuery(spaceId || '')
  const { data: profile } = getProfileQuery.useQuery(ownerId)

  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex gap-2'>
        <PostImage profile={profile} space={space} ownerId={ownerId} />
        <div className='flex flex-col gap-[10px]'>
          <Name address={ownerId} className='text-sm leading-none !text-text' />

          <span className='text-xs leading-none'>
            <SpaceLink spaceId={spaceId} /> •{' '}
            {getTimeRelativeToNow(createdAtTime)}
          </span>
        </div>
      </div>
      <div>
        <PostDropdownMenu postId={struct.id} />
      </div>
    </div>
  )
}

type PostImageProps = {
  profile?: SubsocialProfile | null
  space?: SpaceData | null
  ownerId: string
}

const PostImage = ({ profile, space, ownerId }: PostImageProps) => {
  const { profileSpace } = profile || {}

  const { content: profileContent, id: profileSpaceId } = profileSpace || {}
  const { id: spaceId, content: spaceContent } = space || {}

  const isSameSpace = profileSpaceId === spaceId

  return (
    <div className='flex'>
      <AddressAvatar
        address={ownerId}
        forceProfileSource={{
          profileSource: 'subsocial-profile',
          content: profileContent || {},
        }}
      />

      {!isSameSpace && (
        <AddressAvatar
          address={ownerId}
          forceProfileSource={{
            content: spaceContent || {},
          }}
          className='ml-[-20px]'
        />
      )}
    </div>
  )
}

export default PostInfoPreview
