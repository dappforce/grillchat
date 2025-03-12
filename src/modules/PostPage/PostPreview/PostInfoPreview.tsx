import AddressAvatar from '@/components/AddressAvatar'
import Name from '@/components/Name'
import SpaceAvatar from '@/components/SpaceAvatar'
import ChatRelativeTime from '@/components/chats/ChatItem/ChatRelativeTime'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { getSpaceQuery } from '@/services/datahub/spaces/query'
import { PostData } from '@subsocial/api/types'
import Link from 'next/link'
import PostDropdownMenu from '../PostDropdownMenu'

type PostInfoPreviewProps = {
  post: PostData
}

const PostInfoPreview = ({ post }: PostInfoPreviewProps) => {
  const { struct, content } = post

  if (!struct || !content) return null

  const { createdByAccount, spaceId, createdAtTime } = struct
  const { data: profile } = getProfileQuery.useQuery(createdByAccount || '')

  const { data: space } = getSpaceQuery.useQuery(spaceId || '')

  const profileSpaceId = profile?.profileSpace?.id

  const isProfileSpace = spaceId === profileSpaceId

  if (!space) return null

  const { content: spaceContent } = space

  return (
    <div className='flex items-center gap-2'>
      <div className='flex gap-2'>
        {isProfileSpace ? (
          <AddressAvatar
            address={createdByAccount}
            className='h-[36px] w-[36px]'
          />
        ) : (
          <div className='flex items-center'>
            <SpaceAvatar space={space} className='h-[36px] w-[36px]' />{' '}
            <AddressAvatar
              address={createdByAccount}
              className='ml-[-20px] h-[36px] w-[36px]'
            />
          </div>
        )}
      </div>
      <div className='flex w-full items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <Name address={createdByAccount} />
          <div>
            <Link href=''>
              <span className='text-sm text-text-muted'>
                {spaceContent?.name} •{' '}
                <ChatRelativeTime createdAtTime={createdAtTime} />
              </span>
            </Link>
          </div>
        </div>
        <span className='ml-3 flex items-center gap-2'>
          <PostDropdownMenu
            postData={post as any}
            className='text-text-muted'
          />
        </span>
      </div>
    </div>
  )
}

export default PostInfoPreview
