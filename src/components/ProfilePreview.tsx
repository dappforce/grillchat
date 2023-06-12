import EthIcon from '@/assets/icons/eth.svg'
import GrillIcon from '@/assets/icons/grill.svg'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import AddressAvatar from './AddressAvatar'
import { CopyTextInline } from './CopyText'
import Name from './Name'

type ProfilePreviewProps = {
  address: string
  className?: string
  evmAddress?: string
  avatarClassName?: string
  withGrillAddress?: boolean
}

const ProfilePreview = ({
  address,
  className,
  evmAddress,
  avatarClassName,
  withGrillAddress = true,
}: ProfilePreviewProps) => {
  return (
    <div className={cx('flex items-center gap-4', className)}>
      <AddressAvatar
        address={address}
        className={cx(avatarClassName ? avatarClassName : 'h-20 w-20')}
      />
      <div className='flex flex-col gap-3'>
        <Name ownerId={address} className='text-lg leading-none' />
        <div className='flex flex-col gap-1'>
          {withGrillAddress && (
            <div className='flex flex-row items-center gap-2'>
              <GrillIcon />
              <CopyTextInline
                text={truncateAddress(address)}
                tooltip='Copy my Grill public address'
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
                tooltip='Copy my EVM address'
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
