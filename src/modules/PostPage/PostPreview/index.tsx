import Button from '@/components/Button'
import Drawer from '@/components/Drawer'
import MdRendererRaw from '@/components/MdRenderer'
import SummarizeMd from '@/components/SummarizeMd'
import { getPostQuery } from '@/services/api/query'
import { useHideUnhidePost } from '@/services/subsocial/posts/mutation'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { SummarizedContent } from '@subsocial/api/types'
import { nonEmptyStr } from '@subsocial/utils'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import { IoMdAlert } from 'react-icons/io'
import ChatRoom from '../../../components/chats/ChatRoom/index'
import { ShareDropdown } from '../../../components/share/index'
import { renderPostTitle } from '../ViewPost'
import PostInfoPreview from './PostInfoPreview'

type SpacePreviewProps = {
  postId: string
  withTags?: boolean
  withStats?: boolean
  showFullAbout?: boolean
  withWrapper?: boolean
}

const PostPreview = ({
  postId,
  showFullAbout = false,
  withWrapper = true,
}: SpacePreviewProps) => {
  const myAddress = useMyMainAddress()
  const [collapseAbout, setCollapseAbout] = useState(true)
  const client = useQueryClient()
  const { data: postData } = getPostQuery.useQuery(postId, {
    showHiddenPost: {
      type: 'owner',
      owner: myAddress || '',
    },
  })
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const { mutateAsync } = useHideUnhidePost({
    onSuccess: () => {
      getPostQuery.invalidate(client, postId)
    },
  })

  const isMy = postData?.struct.ownerId === myAddress

  const { content, struct } = postData || {}

  const { summary } = content || {}

  const isHidden = struct?.hidden

  const postTitle = renderPostTitle(postData as any)

  const title = (
    <div className='flex items-center gap-2'>
      <span className='text-[26px] font-medium leading-[1.25]'>
        {postTitle}
      </span>
    </div>
  )

  const onToggleShow = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setCollapseAbout((prev) => !prev)
  }

  const postSummary = (
    <div>
      {nonEmptyStr(summary) && (
        <div className='mt-3 block text-sm'>
          {showFullAbout || !collapseAbout ? (
            <>
              <MdRendererRaw source={summary} className='text-white' />
              {!showFullAbout && (
                <div
                  className='mt-2 font-semibold transition-colors hover:text-text-primary'
                  onClick={onToggleShow}
                >
                  Show Less
                </div>
              )}
            </>
          ) : (
            <SummarizeMd
              content={content as SummarizedContent}
              className='text-sm'
              more={
                <span
                  className='text-sm font-semibold transition-colors hover:text-text-primary'
                  onClick={onToggleShow}
                >
                  Show More
                </span>
              }
            />
          )}
        </div>
      )}
    </div>
  )

  if (!postData) return null

  const preview = (
    <div
      className={cx('flex w-full flex-col gap-4 overflow-hidden', {
        ['rounded-[20px] bg-white shadow-[0_0_20px_#e2e8f0] dark:bg-slate-800 dark:shadow-[0_0_20px_#0000]']:
          withWrapper,
      })}
    >
      {isHidden && isMy && (
        <div className='flex items-center justify-between gap-2 bg-[#fffbe6] px-4 py-2'>
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
      <div
        className={cx('w-full', {
          ['p-5']: withWrapper,
        })}
      >
        <div className='flex w-full flex-col gap-2'>
          <PostInfoPreview post={postData} />
          <div className='flex flex-col'>
            <div className={clsx('flex items-center justify-between')}>
              {title}
            </div>
            {summary && postSummary}
          </div>
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
      </div>
    </div>
  )

  return (
    <>
      {withWrapper ? (
        <Link
          href={`/space/${postData.struct.spaceId}/${postId}`}
          className='w-full'
        >
          {preview}
        </Link>
      ) : (
        preview
      )}
      <Drawer isOpen={isCommentsOpen} setIsOpen={setIsCommentsOpen}>
        <ChatRoom
          chatId={postId}
          hubId={postData.struct.spaceId || ''}
          asContainer
        />
      </Drawer>
    </>
  )
}

export default PostPreview
