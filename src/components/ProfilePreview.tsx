import EthIcon from '@/assets/icons/eth.svg'
import GrillIcon from '@/assets/icons/grill.svg'
import useRandomColor from '@/hooks/useRandomColor'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import AddressAvatar from './AddressAvatar'
import { CopyTextInline } from './CopyText'
import Name from './Name'

type ProfilePreviewProps = {
  address: string
  className?: string
}

const ProfilePreview = ({ address, className }: ProfilePreviewProps) => {
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const { evmAddress } = accountData || {}

  const senderColor = useRandomColor(address)

  return (
    <div className={cx('flex items-center gap-4', className)}>
      <AddressAvatar address={address} className='h-20 w-20' />
      <div className='flex flex-col gap-3'>
        <Name
          ownerId={address}
          className='text-lg leading-none'
          senderColor={senderColor}
        />
        <div className='flex flex-col gap-1'>
          <div className='flex flex-row items-center gap-2'>
            <GrillIcon />
            <CopyTextInline
              text={truncateAddress(address)}
              tooltip='Copy my Grill public address'
              textToCopy={address}
              tooltipPlacement='top'
              textClassName='font-mono leading-none'
            />
          </div>
          {evmAddress && (
            <div className='flex flex-row items-center gap-2'>
              <EthIcon />
              <CopyTextInline
                text={truncateAddress(evmAddress)}
                tooltip='Copy my EVM address'
                textToCopy={evmAddress}
                textClassName='font-mono leading-none'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePreview
