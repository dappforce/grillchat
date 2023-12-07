import EthIcon from '@/assets/icons/eth-dynamic-size.svg'
import GrillIcon from '@/assets/icons/grill.svg'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyMainAddress } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { ProfileSource } from '@/utils/profile'
import { ProfileContent } from '@subsocial/api/types'
import { ComponentProps } from 'react'
import { HiPencil } from 'react-icons/hi2'
import AddressAvatar from './AddressAvatar'
import Button from './Button'
import { CopyTextInline } from './CopyText'
import PopOver from './floating/PopOver'
import Name, { useName } from './Name'

export type ForceProfileSource = {
  profileSource?: ProfileSource
  content?: ProfileContent
}

export type ProfilePreviewProps = ComponentProps<'div'> & {
  address: string
  forceProfileSource?: ForceProfileSource
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
  forceProfileSource,
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
  const { isLoading } = useName(address)
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
        forceProfileSource={forceProfileSource}
      />
      <div className={cx('flex flex-col gap-1', addressesContainerClassName)}>
        <div className='relative left-1 flex items-center gap-2'>
          <Name
            profileSourceIconClassName='text-xl'
            profileSourceIconPosition='left'
            showOnlyCustomIdentityIcon
            address={address}
            className={cx('gap-1 text-lg', nameClassName)}
            forceProfileSource={forceProfileSource}
          />
          {onEditClick && !isLoading && (
            <PopOver
              panelSize='sm'
              triggerOnHover
              placement='top'
              yOffset={6}
              trigger={
                <Button
                  size='noPadding'
                  className='relative top-px p-1 text-text-primary'
                  variant='transparent'
                  onClick={onEditClick}
                >
                  <HiPencil />
                </Button>
              }
            >
              <p>Edit my profile</p>
            </PopOver>
          )}
        </div>
        {showingAnyAddress && (
          <div className='flex flex-col gap-1'>
            {withGrillAddress &&
              (!isShowingEvmAddress || !showMaxOneAddress) && (
                <div className='flex flex-row items-center gap-2'>
                  <GrillIcon className='text-xl text-text-muted' />
                  <CopyTextInline
                    text={truncateAddress(address)}
                    tooltip={`Copy${isMyAddressPart} Grill public address`}
                    textToCopy={address}
                    textClassName={cx(
                      'font-mono text-[15px] leading-[14px] whitespace-nowrap overflow-hidden overflow-ellipsis'
                    )}
                  />
                </div>
              )}
            {isShowingEvmAddress && (
              <div className='flex flex-row items-center gap-2'>
                <EthIcon className='relative left-1 text-xl text-text-muted' />
                <CopyTextInline
                  text={truncateAddress(evmAddress)}
                  tooltip={`Copy${isMyAddressPart} EVM address`}
                  textToCopy={evmAddress}
                  textClassName={cx(
                    'font-mono text-[15px] leading-[14px] whitespace-nowrap overflow-hidden overflow-ellipsis'
                  )}
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
