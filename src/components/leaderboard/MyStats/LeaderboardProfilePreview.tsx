import AddressAvatar from '@/components/AddressAvatar'
import Name from '@/components/Name'
import { mutedTextColorStyles } from '@/components/content-staking/utils/commonStyles'
import { getProfileQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import LeaderboardRoleRadioGroup from '../LeaderboardRadioGroup'

type LeaderboardProfilePreviewProps = {
  address: string
}

const LeaderboardProfilePreview = ({
  address,
}: LeaderboardProfilePreviewProps) => {
  const { data: profile } = getProfileQuery.useQuery(address)

  const about = profile?.profileSpace?.content?.about

  return (
    <div
      className={cx(
        'flex flex-col items-center gap-4 rounded-[20px] border border-[#6366F1]/20 bg-[#0053FF]/10 p-4'
      )}
    >
      <AddressAvatar address={address} className='h-[70px] w-[70px]' />
      <div className='flex w-full flex-col items-center gap-2'>
        <Name
          address={address}
          className='text-[22px] font-semibold leading-6 !text-text'
        />
        {about && (
          <div
            className={cx(
              'w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-center',
              mutedTextColorStyles
            )}
          >
            {about}
          </div>
        )}
      </div>

      <LeaderboardRoleRadioGroup />
    </div>
  )
}

export default LeaderboardProfilePreview
