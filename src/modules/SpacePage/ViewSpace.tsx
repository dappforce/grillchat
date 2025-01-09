import { DfMd } from '@/components/DfMd'
import SpaceAvatar from '@/components/SpaceAvatar'
import SummarizeMd from '@/components/SummarizeMd'
import ViewTags from '@/components/ViewTags'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useMyMainAddress } from '@/stores/my-account'
import { SpaceData, SummarizedContent } from '@subsocial/api/types'
import { isEmptyStr, nonEmptyStr } from '@subsocial/utils'
import clsx from 'clsx'
import { useCallback, useState } from 'react'
import { isMobile } from 'react-device-detect'

type Props = {
  spaceData?: SpaceData
  showFullAbout?: boolean
  withTags?: boolean
}

export const renderSpaceName = (space: SpaceData) => {
  const name = space?.content?.name
  const spaceName = isEmptyStr(name) ? (
    <span className='text-text-muted'>{'Unnamed Space'}</span>
  ) : (
    name
  )

  return spaceName
}

const ViewSpace = ({
  spaceData,
  showFullAbout = false,
  withTags = true,
}: Props) => {
  const myAddress = useMyMainAddress()
  const [collapseAbout, setCollapseAbout] = useState(true)

  const isMy = spaceData?.struct.ownerId === myAddress
  const { data: ownerProfile } = getProfileQuery.useQuery(
    spaceData?.struct.ownerId || ''
  )
  const profileId = ownerProfile?.profileSpace?.id

  const isProfileSpace = spaceData?.id === profileId

  const Avatar = useCallback(() => {
    if (!spaceData) return null

    return <SpaceAvatar space={spaceData} imageSize={48} />
  }, [spaceData])

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
      <div className='d-flex flex-column w-100'>
        <div className={clsx('DfSpaceBody w-100')}>
          <Avatar />
          <div className={clsx('w-100 ml-2', isMobile && 'mt-1')}>
            <div className='d-flex flex-column GapTiny'>
              <div
                className={clsx(
                  'd-flex justify-content-between align-items-center'
                )}
              >
                {title}
                <span className='d-flex align-items-center GapTiny ml-2'>
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

  return <div>{renderPreview()}</div>
}

export default ViewSpace
