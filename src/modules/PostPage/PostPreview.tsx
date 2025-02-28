import Button from '@/components/Button'
import { DfMd } from '@/components/DfMd'
import SummarizeMd from '@/components/SummarizeMd'
import ViewTags from '@/components/ViewTags'
import { getPostQuery } from '@/services/api/query'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { SummarizedContent } from '@subsocial/api/types'
import { nonEmptyStr } from '@subsocial/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import { CiEdit } from 'react-icons/ci'
import PostDropdownMenu from './PostDropdownMenu'
import { renderPostTitle } from './ViewPost'

type SpacePreviewProps = {
  spaceId: string
  withTags?: boolean
  withStats?: boolean
  showFullAbout?: boolean
  withWrapper?: boolean
}

const PostPreview = ({
  spaceId,
  withTags = true,
  withStats = true,
  showFullAbout = false,
  withWrapper = true,
}: SpacePreviewProps) => {
  const myAddress = useMyMainAddress()
  const [collapseAbout, setCollapseAbout] = useState(true)
  const { data: postData } = getPostQuery.useQuery(spaceId)

  const isMy = postData?.struct.ownerId === myAddress
  const { data: ownerProfile } = getProfileQuery.useQuery(
    postData?.struct.ownerId || ''
  )
  const profileId = ownerProfile?.profileSpace?.id

  const isProfileSpace = postData?.id === profileId

  const { content, struct } = postData || {}

  const { summary, tags } = content || {}

  const postTitle = renderPostTitle(postData as any)

  const title = (
    <div className='flex items-center gap-2'>
      <span className='text-[32px] font-medium leading-[1.25]'>
        {postTitle}
      </span>
      {isMy && (
        <div className='rounded-md border border-[#b7eb8f] bg-[#f6ffed] px-2 text-xs font-semibold leading-[20px] text-[#52c41a]'>
          {isProfileSpace ? 'My Profile' : 'My Space'}
        </div>
      )}
    </div>
  )

  const onToggleShow = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setCollapseAbout((prev) => !prev)
  }

  const spaceAbout = (
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

      {withTags && <ViewTags tags={tags} className='mt-1' />}
    </div>
  )

  const previewButtons = (size: 'xs' | 'md' = 'md') => (
    <div className='flex items-center gap-2'>
      {!isMobile && isMy && (
        <Button
          href={`/${spaceId}/edit`}
          variant={'primaryOutline'}
          size={size}
          className='flex items-center gap-2'
        >
          <CiEdit /> Edit
        </Button>
      )}

      <>
        {isProfileSpace && isMy ? (
          <>Chat button</>
        ) : (
          <Button variant={'primary'} size={size}>
            Follow
          </Button>
        )}
      </>
    </div>
  )

  const preview = (
    <div
      className={cx('w-full', {
        ['rounded-[20px] bg-white p-5 shadow-[0_0_20px_#e2e8f0]']: withWrapper,
      })}
    >
      <div>
        <div className='flex w-full flex-col'>
          <div className={clsx('w-100 flex items-center gap-4')}>
            <div className={clsx('w-full flex-1')}>
              <div className='d-flex flex-column GapTiny'>
                <div className={clsx('flex items-center justify-between')}>
                  {title}
                  <span className='ml-3 flex items-center gap-2'>
                    <PostDropdownMenu postData={postData as any} />
                    {!isMobile && previewButtons('md')}
                  </span>
                </div>
                {isMobile && previewButtons('md')}
              </div>
              {!isMobile && spaceAbout}
            </div>
          </div>
          {isMobile && <div className='mt-1'>{spaceAbout}</div>}
        </div>
      </div>
    </div>
  )

  return withWrapper ? (
    <Link href={`/space/${spaceId}`} className='w-full'>
      {preview}
    </Link>
  ) : (
    preview
  )
}

export default PostPreview
