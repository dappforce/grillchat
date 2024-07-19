import MenuList from '@/components/MenuList'
import ProfilePreview from '@/components/ProfilePreview'
import { Skeleton } from '@/components/SkeletonFallback'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import useIsModerationAdmin from '@/hooks/useIsModerationAdmin'
import useTgLink from '@/hooks/useTgLink'
import { getUserReferralsQuery } from '@/services/datahub/leaderboard/query'
import { formatNumber } from '@/utils/strings'
import { FaPaperPlane } from 'react-icons/fa6'

export default function ProfileDetailModal({
  address,
  ...props
}: ModalFunctionalityProps & { address: string }) {
  const { telegramLink, isLoading } = useTgLink(address)
  const { data: referralData } = getUserReferralsQuery.useQuery(address || '')
  const isAdmin = useIsModerationAdmin()
  if (!isAdmin) return null

  return (
    <Modal {...props} title='Profile' withCloseButton>
      <div className='flex flex-col gap-3 border-b border-b-border-gray pb-4'>
        <ProfilePreview asLink address={address} />
        <div className='grid grid-cols-1'>
          <div className='grid grid-cols-[max-content_1fr] gap-2'>
            <span className='text-text-muted'>Referrals Count</span>
            <span>
              <span className='text-text-muted'>: </span>
              {referralData ? (
                formatNumber(referralData.refCount)
              ) : (
                <Skeleton />
              )}
            </span>
            <span className='text-text-muted'>Points from Referral</span>
            <span>
              <span className='text-text-muted'>: </span>
              {referralData ? (
                formatNumber(referralData.pointsEarned)
              ) : (
                <Skeleton />
              )}
            </span>
          </div>
        </div>
      </div>
      <MenuList
        className='-mx-3 -mb-5 w-[calc(100%_+_1.5rem)] px-0'
        menus={[
          {
            text: 'Message User',
            icon: FaPaperPlane,
            href: telegramLink,
            disabled: isLoading,
          },
        ]}
      />
    </Modal>
  )
}
