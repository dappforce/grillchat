import EthIcon from '@/assets/icons/eth.svg'
import GrillIcon from '@/assets/icons/grill.svg'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyMainAddress } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { HiPencil } from 'react-icons/hi2'
import AddressAvatar from './AddressAvatar'
import Button from './Button'
import { CopyTextInline } from './CopyText'
import Name from './Name'

export type ProfilePreviewProps = ComponentProps<'div'> & {
  address: string
  className?: string
  avatarClassName?: string
  addressesContainerClassName?: string
  showMaxOneAddress?: boolean
  withGrillAddress?: boolean
  withEvmAddress?: boolean
  nameClassName?: string
  onEditClick?: () => void
}

const ProfilePreview = ({
  address,
  className,
  avatarClassName,
  nameClassName,
  addressesContainerClassName,
  onEditClick,
  showMaxOneAddress = false,
  withGrillAddress = true,
  withEvmAddress = true,
  ...props
}: ProfilePreviewProps) => {
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const { evmAddress } = accountData || {}
  const myAddress = useMyMainAddress()

  const isMyAddressPart = myAddress === address ? ' my' : ''

  const isShowingEvmAddress = withEvmAddress && evmAddress
  const showingAnyAddress = withGrillAddress || isShowingEvmAddress

  return (
    <div {...props} className={cx('flex items-center gap-4', className)}>
      <AddressAvatar
        address={address}
        className={cx('h-20 w-20', avatarClassName)}
      />
      <div className={cx('flex flex-col gap-1', addressesContainerClassName)}>
        <div className='flex items-center'>
          <Name
            address={address}
            showEthIcon={false}
            className={cx('text-lg', nameClassName)}
          />
          {onEditClick && (
            <Button
              size='noPadding'
              className='relative top-px ml-2 p-1 text-text-primary'
              variant='transparent'
              onClick={onEditClick}
            >
              <HiPencil />
            </Button>
          )}
        </div>
        {showingAnyAddress && (
          <div className='flex flex-col gap-1'>
            {withGrillAddress &&
              (!isShowingEvmAddress || !showMaxOneAddress) && (
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
            {isShowingEvmAddress && (
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
        )}
      </div>
    </div>
  )
}

export default ProfilePreview
