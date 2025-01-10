import { DfMd } from '@/components/DfMd'
import SpaceAvatar from '@/components/SpaceAvatar'
import SummarizeMd from '@/components/SummarizeMd'
import ViewTags from '@/components/ViewTags'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { getSpaceQuery } from '@/services/datahub/spaces/query'
import { useMyMainAddress } from '@/stores/my-account'
import { SummarizedContent } from '@subsocial/api/types'
import { nonEmptyStr } from '@subsocial/utils'
import clsx from 'clsx'
import { useCallback, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { renderSpaceName } from './ViewSpace'

type SpacePreviewProps = {
  spaceId: string
  withTags?: boolean
  showFullAbout?: boolean
}

const SpacePreview = ({
  spaceId,
  withTags = false,
  showFullAbout = false,
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

  console.log(spaceData)

  if (!spaceData) return null

  const { content, struct } = spaceData || {}

  const { about, tags, email, links } = content || {}
  const contactInfo = { email, links }

  const spaceName = renderSpaceName(spaceData)

  const title = (
    <div>
      <span className='text-[32px] font-medium leading-[1.25]'>
        {spaceName}
      </span>
      {isMy && (
        <div className='border border-green-500 bg-green-300 text-green-600'>
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

  const renderPreview = () => (
    <div>
      <div className='flex w-full flex-col items-center'>
        <div className={clsx('w-100 flex items-center gap-4')}>
          <Avatar />
          <div className={clsx('w-full flex-1')}>
            <div className='d-flex flex-column GapTiny'>
              <div className={clsx('flex items-center justify-between')}>
                {title}
                <span className='ml-3 flex items-center gap-2'>
                  {/* <SpaceDropdownMenu spaceOwnerId={space.ownerId} spaceData={spaceData} /> */}
                  {/* {!isMobile && previewButtons('middle')} */}
                </span>
              </div>
              {/* {isMobile && previewButtons('middle')} */}
            </div>
            {!isMobile && spaceAbout}
          </div>
        </div>
        {isMobile && <div className='mt-1'>{spaceAbout}</div>}
      </div>
    </div>
  )

  return <div className='rounded-[20px] bg-white p-5'>{renderPreview()}</div>
}

export default SpacePreview
