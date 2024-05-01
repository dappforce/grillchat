import AddressAvatar from '@/components/AddressAvatar'
import Name from '@/components/Name'
import { mutedTextColorStyles } from '@/components/content-staking/utils/commonStyles'
import { getProfileQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import LeaderboardRoleRadioGroup from '../LeaderboardRadioGroup'

type LeaderboardProfilePreviewProps = {
  address: string
  rank: number | null
}

const LeaderboardProfilePreview = ({
  address,
  rank,
}: LeaderboardProfilePreviewProps) => {
  const { data: profile } = getProfileQuery.useQuery(address)

  const about = profile?.profileSpace?.content?.about

  return (
    <div
      className={cx(
        'relative flex gap-4 rounded-[20px] border md:flex-col md:items-center',
        'border-[#6366F1]/20 bg-[#EDF4FF] p-4 dark:bg-[#0053FF]/10'
      )}
    >
      {rank && (
        <span
          className={cx(
            mutedTextColorStyles,
            'absolute right-4 top-4 font-semibold md:left-4'
          )}
        >
          #{rank + 1}
        </span>
      )}
      <AddressAvatar address={address} className='h-[70px] w-[70px]' />
      <div className='flex w-full flex-col gap-2 md:items-center'>
        <Name
          address={address}
          className='text-xl font-semibold leading-6 !text-text md:text-[22px]'
        />
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

export default LeaderboardProfilePreview
