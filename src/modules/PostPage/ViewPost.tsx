import Button from '@/components/Button'
import Drawer from '@/components/Drawer'
import MdRendererRaw from '@/components/MdRenderer'
import MediaLoader from '@/components/MediaLoader'
import ViewTags from '@/components/ViewTags'
import ChatRoom from '@/components/chats/ChatRoom'
import { ShareDropdown } from '@/components/share'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'
import { isEmptyStr } from '@subsocial/utils'
import { useState } from 'react'
import SpacePreview from '../SpacePage/SpacePreview'
import PostInfoPreview from './PostPreview/PostInfoPreview'

type Props = {
  postData?: PostData
  showFullAbout?: boolean
  withTags?: boolean
}

export const renderPostTitle = (post?: PostData | null) => {
  const name = post?.content?.title
  const spaceName = isEmptyStr(name) ? null : (
    <span className='text-[32px] font-medium leading-[1.25]'>{name}</span>
  )

  return spaceName
}

const ViewPost = ({ postData }: Props) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  if (!postData) return null

  const tags = postData.content?.tags
  const image = postData.content?.image

  return (
    <>
      <div className='flex flex-col gap-6 p-4'>
        <PostInfoPreview post={postData} />

        <div
          className={cx(
            'w-full rounded-[20px] bg-white p-5 shadow-[0_0_20px_#e2e8f0] dark:bg-slate-800 dark:shadow-[0_0_20px_#0000]'
          )}
        >
          <div className='flex w-full flex-col gap-2'>
            {image && (
              <MediaLoader
                containerClassName={cx(
                  'max-h-[436px] w-full rounded-[10px] overflow-hidden'
                )}
                src={image}
                className={cx('h-full w-full object-cover', {})}
              />
            )}
            <div className='flex items-center justify-between'>
              {renderPostTitle(postData)}
            </div>
            {postData.content?.body && (
              <MdRendererRaw source={postData.content.body} />
            )}
          </div>
          <ViewTags tags={tags} className='mt-5' />
          <div className='flex w-full items-center justify-end gap-4'>
            <Button
              variant={'transparent'}
              className='text-text-muted'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()

                setIsCommentsOpen(true)
              }}
            >
              Comments
            </Button>
            <ShareDropdown
              postDetails={postData}
              spaceId={postData.struct.spaceId || ''}
              className='text-text-muted'
            />
          </div>
        </div>
        <SpacePreview spaceId={postData.struct.spaceId || ''} withWrapper />
      </div>

      <Drawer isOpen={isCommentsOpen} setIsOpen={setIsCommentsOpen}>
        <ChatRoom
          chatId={postData.id}
          hubId={postData.struct.spaceId || ''}
          asContainer
        />
      </Drawer>
    </>
  )
}

export default ViewPost
