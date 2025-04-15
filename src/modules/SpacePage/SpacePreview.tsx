import Button from '@/components/Button'
import { DfMd } from '@/components/DfMd'
import FollowUnfollowSpaceButton from '@/components/FollowUnfollowSpaceButton'
import SpaceAvatar from '@/components/SpaceAvatar'
import SummarizeMd from '@/components/SummarizeMd'
import ViewTags from '@/components/ViewTags'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { getSpaceQuery } from '@/services/datahub/spaces/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { SummarizedContent } from '@subsocial/api/types'
import { nonEmptyStr } from '@subsocial/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { CiEdit } from 'react-icons/ci'
import SpaceDropdownMenu from './SpaceDropdownMenu'
import SpaceStatsRow from './SpaceStatsRow'
import { renderSpaceName } from './ViewSpace'

type SpacePreviewProps = {
  spaceId: string
  withTags?: boolean
  withStats?: boolean
  showFullAbout?: boolean
  withWrapper?: boolean
}

const SpacePreview = ({
  spaceId,
  withTags = true,
  withStats = true,
  showFullAbout = false,
  withWrapper = true,
}: SpacePreviewProps) => {
  const myAddress = useMyMainAddress()
  const [collapseAbout, setCollapseAbout] = useState(true)
  const { data: spaceData } = getSpaceQuery.useQuery(spaceId)

  const isMy = spaceData?.struct.ownerId === myAddress
  const { data: ownerProfile } = getProfileQuery.useQuery(
    spaceData?.struct.ownerId || ''
  )
  const profileId = ownerProfile?.profileSpace?.id

  const isProfileSpace = spaceData?.id === profileId

  const Avatar = useCallback(() => {
    if (!spaceData) return null

    return <SpaceAvatar space={spaceData} imageSize={62} />
  }, [spaceData])

  if (!spaceData) return null

  const { content, struct } = spaceData || {}

  const { about, tags, email, links } = content || {}
  const contactInfo = { email, links }

  const spaceName = renderSpaceName(spaceData)

  const title = (
    <div className='flex items-center gap-2'>
      <span className='text-[32px] font-medium leading-[1.25]'>
        {spaceName}
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
      {nonEmptyStr(about) && (
        <div className='mt-3 block text-sm'>
          {showFullAbout || !collapseAbout ? (
            <>
              <DfMd source={about} className='text-sm' />
              {!showFullAbout && (
                <div
                  className='mt-2 font-semibold hover:text-text-primary'
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
                  className='hover:text-text-primary! text-sm font-semibold'
                  onClick={onToggleShow}
                >
                  Show More
                </span>
              }
            />
          )}
        </div>
      )}

      {withTags && <ViewTags tags={tags} className='mt-1' />}

      {withStats && (
        <span className='mt-4 flex flex-wrap justify-between'>
          <SpaceStatsRow space={spaceData.struct} />
          {/* {!preview && <ContactInfo {...contactInfo} />} */}
        </span>
      )}
    </div>
  )

  const previewButtons = (size: 'xs' | 'md' = 'md') => (
    <div className='flex items-center gap-2'>
      {!isMobile && isMy && (
        <Button
          href={`/space/${spaceId}/edit`}
          variant={'primaryOutline'}
          size={size}
          className='flex items-center gap-2'
        >
          <CiEdit /> Edit
        </Button>
      )}

      {!isMy && <FollowUnfollowSpaceButton size={size} spaceId={spaceId} />}
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
            <Avatar />
            <div className={clsx('w-full flex-1')}>
              <div className='d-flex flex-column GapTiny'>
                <div className={clsx('flex items-center justify-between')}>
                  {title}
                  <span className='ml-3 flex items-center gap-2'>
                    <SpaceDropdownMenu spaceData={spaceData} />
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

export default SpacePreview
