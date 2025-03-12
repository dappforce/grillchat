import { DfMd } from '@/components/DfMd'
import SummarizeMd from '@/components/SummarizeMd'
import { getPostQuery } from '@/services/api/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { SummarizedContent } from '@subsocial/api/types'
import { nonEmptyStr } from '@subsocial/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
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
  withTags = true,
  withStats = true,
  showFullAbout = false,
  withWrapper = true,
}: SpacePreviewProps) => {
  const myAddress = useMyMainAddress()
  const [collapseAbout, setCollapseAbout] = useState(true)
  const { data: postData } = getPostQuery.useQuery(postId)

  const isMy = postData?.struct.ownerId === myAddress

  const { content } = postData || {}

  const { summary } = content || {}

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
              <DfMd source={summary} className='text-sm' />
              {!showFullAbout && (
                <div className='mt-2 font-semibold' onClick={onToggleShow}>
                  Show Less
                </div>
              )}
            </>
          ) : (
            <SummarizeMd
              content={content as SummarizedContent}
              className='text-sm'
              more={
                <span className='text-sm font-semibold' onClick={onToggleShow}>
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
      className={cx('w-full', {
        ['rounded-[20px] bg-white p-5 shadow-[0_0_20px_#e2e8f0]']: withWrapper,
      })}
    >
      <div className='flex w-full flex-col gap-2'>
        <PostInfoPreview post={postData} />
        <div className='flex flex-col gap-4'>
          <div className={clsx('flex items-center justify-between')}>
            {title}
          </div>
          {summary && postSummary}
        </div>
        <div className='flex w-full items-center justify-end gap-4'>
          <ShareDropdown
            postDetails={postData}
            spaceId={postData.struct.spaceId || ''}
            className='text-text-muted'
          />
        </div>
      </div>
    </div>
  )

  return withWrapper ? (
    <Link href={`/space/${postId}`} className='w-full'>
      {preview}
    </Link>
  ) : (
    preview
  )
}

export default PostPreview
