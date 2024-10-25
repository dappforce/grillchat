import AddressAvatar from '@/components/AddressAvatar'
import Name from '@/components/Name'
import { mutedTextColorStyles } from '@/components/content-staking/utils/commonStyles'
import PopOver from '@/components/floating/PopOver'
import { getProfileQuery } from '@/old/services/api/query'
import { LeaderboardRole } from '@/old/services/datahub/leaderboard/types'
import { cx } from '@/utils/class-names'
import CustomLink from '../../referral/CustomLink'
import LeaderboardRoleRadioGroup from '../LeaderboardRadioGroup'

type LeaderboardProfilePreviewProps = {
  address: string
  rank: number | null
  leaderboardRole: LeaderboardRole
}

const LeaderboardProfilePreview = ({
  address,
  rank,
  leaderboardRole,
}: LeaderboardProfilePreviewProps) => {
  const { data: profile } = getProfileQuery.useQuery(address)

  const about = profile?.profileSpace?.content?.about

  const profileSpaceId = profile?.profileSpace?.id

  return (
    <div
      className={cx(
        'relative flex justify-center gap-4 rounded-[20px] border md:flex-col md:items-center',
        ' p-4',
        {
          ['border-[rgba(99,102,241,.2)] bg-[#edf4ff] dark:bg-[rgba(0,83,255,0.10)]']:
            leaderboardRole === 'staker',
          ['border-[rgba(168,21,128,.2)] bg-[#faeff9] dark:bg-[rgba(0,83,255,0.10)]']:
            leaderboardRole === 'creator',
        }
      )}
    >
      {rank !== null && (
        <span
          className={cx(
            mutedTextColorStyles,
            'absolute right-4 top-4 font-semibold md:left-4'
          )}
        >
          #{rank}
        </span>
      )}
      <ProfileLink spaceId={profileSpaceId || ''}>
        <AddressAvatar address={address} className='h-[70px] w-[70px]' />
      </ProfileLink>
      <div className='flex w-full flex-col gap-2 md:items-center'>
        <ProfileLink spaceId={profileSpaceId || ''}>
          <Name
            address={address}
            className='text-xl font-semibold leading-6 !text-text hover:!text-text-primary md:text-[22px]'
          />
        </ProfileLink>
        {about && (
          <div
            className={cx(
              'w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-sm md:text-center md:text-base',
              mutedTextColorStyles
            )}
          >
            {about}
          </div>
        )}
        <LeaderboardRoleRadioGroup className='flex w-fit md:hidden' />
      </div>

      <LeaderboardRoleRadioGroup className='hidden md:flex' />
    </div>
  )
}

type ProfileLinkProps = {
  spaceId: string
  children: React.ReactNode
}

const ProfileLink = ({ children, spaceId }: ProfileLinkProps) => {
  return (
    <PopOver
      trigger={
        <CustomLink href={`/${spaceId}`} forceHardNavigation>
          {children}
        </CustomLink>
      }
      panelSize='sm'
      triggerClassName='min-w-fit'
      yOffset={4}
      placement='top'
      triggerOnHover
    >
      Open profile
    </PopOver>
  )
}

export default LeaderboardProfilePreview
