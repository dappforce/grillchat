import EthIcon from '@/assets/icons/eth.svg'
import GrillIcon from '@/assets/icons/grill.svg'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import AddressAvatar from './AddressAvatar'
import { CopyTextInline } from './CopyText'
import Name from './Name'

type ProfilePreviewProps = {
  address: string
  className?: string
  avatarClassName?: string
  withGrillAddress?: boolean
}

const ProfilePreview = ({
  address,
  className,
  avatarClassName,
  withGrillAddress = true,
}: ProfilePreviewProps) => {
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const { evmAddress } = accountData || {}
  const myAddress = useMyAccount((state) => state.address)

  const isMyAddressPart = myAddress === address ? ' my' : ''

  return (
    <div className={cx('flex items-center gap-4', className)}>
      <AddressAvatar
        address={address}
        className={cx('h-20 w-20', avatarClassName)}
      />
      <div className='flex flex-col gap-3'>
        <Name address={address} className='text-lg leading-none' />
        <div className='flex flex-col gap-1'>
          {withGrillAddress && (
            <div className='flex flex-row items-center gap-2'>
              <GrillIcon />
              <CopyTextInline
                text={truncateAddress(address)}
                tooltip={`Copy${isMyAddressPart} Grill public address`}
                textToCopy={address}
                textClassName='font-mono leading-none text-[15px] leading-[14px]'
              />
            </div>
          )}
          {evmAddress && (
            <div className='flex flex-row items-center gap-2'>
              <EthIcon />
              <CopyTextInline
                text={truncateAddress(evmAddress)}
                tooltip={`Copy${isMyAddressPart} EVM address`}
                textToCopy={evmAddress}
                textClassName='font-mono leading-none text-[15px] leading-[14px]'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePreview
